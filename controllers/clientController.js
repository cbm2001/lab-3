const { response, request } = require("express");
const express = require("express");
const { Client } = require("../models/entities");
const clientDAO = require("../db/clientDAO");
const database = require("../db/dbQuery");


const loginControl = (request, response) => {
  const clientServices = require("../services/clientServices");

  let username = request.body.username;
  let password = request.body.password;
  if (!username || !password) {
    response.render('loginfail', { username: `Login failed, please try again` });
  } else {
    if (request.session && request.session.user) {
      response.render("postLogin", { username: username });
    } else {
      clientServices.loginService(
      username,
      password,
      function (err, dberr, client) {
        console.log("Client from login service :" + JSON.stringify(client));
        if (client === null) {
          console.log("Auhtentication problem!");
          response.render('loginfail', { username: `Login failed, please try again` });
        } else {
          console.log("User from login service :" + client[0].num_client);
          //add to session
          request.session.user = username;
          request.session.num_client = client[0].num_client;
          if (username == "Cheryl") {
            request.session.admin = true;
          } else {
            request.session.admin = false;
          }
          response.render("postLogin", { username: username });
        }
      }
    );
  }
}
};

const registerControl = (request, response) => {
  const clientServices = require("../services/clientServices");

  let username = request.body.username;
  let password = request.body.passwsord;
  let society = request.body.society;
  let contact = request.body.contact;
  let address = request.body.address;
  let zipcode = request.body.zipcode;
  let city = request.body.city;
  let phone = request.body.phone;
  let fax = request.body.fax;
  let max_outstanding = request.body.max_outstanding;
  let client = new Client(username, password, 0, society, contact, address, zipcode, city, phone, fax, max_outstanding);
  
  clientServices.registerService(client, function(err, exists, insertedID) {
      console.log("User from register service :" + insertedID);
      if (exists) {
          console.log("Username taken!");
          response.render('postRegister', { message: `Registration failed. Username "${username}" already taken!` });
          //response.send(`registration failed. Username (${username}) already taken!`); //invite to register
      } else {
          client.num_client = insertedID;
          console.log(`Registration (${username}, ${insertedID}) successful!`);
          response.render('postRegister', { message: `Successful registration ${username}!` });
          //response.send(`Successful registration ${client.contact} (ID.${client.num_client})!`);
      }
      response.end();
  });
};

const getClients = (request, response) => {
  const clientServices = require("../services/clientServices");
  clientServices.searchService(function(err, rows) {
      response.json(rows);
      response.end();
  });
};

const getClient = (request, response) => {
  const clientServices = require("../services/clientServices");
  let username = request.session.user;
  if (request.session.admin) {
    const selectClient = "SELECT * from client";
    database.getResult(selectClient, function (err, rows) {
      if (!err) {
        response.render("clientsAdmin", { user: rows });
      } else {
      }
    });
  } else {
    clientDAO.findByUsername(username, function (err, rows) {
      num = rows[0].num_client;
      getClientByNumclient(num, function (err, rows_2) {
        console.log("test");
        console.log(rows_2[0]);
        response.render("clientDetails", {
          username: username,
          num: num,
          society: rows_2[0].society,
          contact: rows_2[0].contact,
          addres: rows_2[0].addres,
          zipcode: rows_2[0].zipcode,
          city: rows_2[0].city,
          phone: rows_2[0].phone,
          fax: rows_2[0].fax,
          max: rows_2[0].max_outstanding,
        });
      });
    });
  }
};
function getClientByNumclient(num, callback) {
  clientDAO.findByNumclient(num, function (err, rows) {
    callback(null, rows);
  });
}

module.exports = {
  loginControl,
  registerControl,
  getClients,
  getClient,
  getClientByNumclient,
};