/*
Javascript file for the Bobby-game

The loading, saving and errors has been done
in a similar way as in the example game given in
the repository
*/
$(document).ready( function() {
  "use strict";

  //wood, stone, food, stamina, money];
  var playerAmounts = [0,0,100, 100, 2000];
  var playerPoints = 0;
  var building_req = [50,70,30,60,0];
  var buildings_built = 1;


  $("#submit_score").click( function () {
    var msg = {
      "messageType": "SCORE",
      "score": parseFloat($("#score").text())
    };
    window.parent.postMessage(msg, "*");
  });

  // Sends this game's state to the service.
  // The format of the game state is decided
  // by the game
  $("#save").click( function () {
    var msg = {
      "messageType": "SAVE",
      "gameState": {
        "playerAmounts": playerAmounts,
        "building_req": building_req,
        "playerPoints": playerPoints,
        "buildings_built": buildings_built
      }
    };
    window.parent.postMessage(msg, "*");
  });

  // Sends a request to the service for a
  // state to be sent, if there is one.
  $("#load").click( function () {
    var msg = {
      "messageType": "LOAD_REQUEST",
    };
    window.parent.postMessage(msg, "*");
  });

  // Listen incoming messages, if the messageType
  // is LOAD then the game state will be loaded.
  // Note that no checking is done, whether the
  // gameState in the incoming message contains
  // correct information.
  //
  // Also handles any errors that the service
  // wants to send (displays them as an alert).
  window.addEventListener("message", function(evt) {
    if(evt.data.messageType === "LOAD") {
      playerAmounts = evt.data.gameState.playerAmounts;
      playerPoints = evt.data.gameState.playerPoints;
      building_req = evt.data.gameState.building_req;
      buildings_built = evt.data.gameState.buildings_built;
      $("#score").text(points);
      update_table();
    } else if (evt.data.messageType === "ERROR") {
      alert(evt.data.info);
    }
  });

  // Gather wood in the game
  $("#get_wood").click( function () {
    var req_list = [-10,0,6,5,0]
    // Check if requirements are filled
    if (check_req(req_list, playerAmounts))
    {
      for (var i=0; i<req_list.length; i++)
      {
        playerAmounts[i] -= req_list[i];
      }
      playerPoints += 15;
      $("#score").text(playerPoints);
      update_table();
    }
  });
  // Gather stone in the game
  $("#get_stone").click( function () {
    var req_list = [0,-10,8,5,0]
    if (check_req(req_list, playerAmounts))
    {
      for (var i=0; i<req_list.length; i++)
      {
        playerAmounts[i] -= req_list[i];
      }
      playerPoints += 10;
      $("#score").text(playerPoints);
      update_table();
    }
  });

  // Buy food in the game
  $("#buy_food").click( function () {
    var req_list = [0,0,-20,0,100]
    if (check_req(req_list, playerAmounts))
    {
      for (var i=0; i<req_list.length; i++)
      {
        playerAmounts[i] -= req_list[i];
      }
      update_table();
    }
  });

  // Go to sleep in the game
  $("#go_sleep").click( function () {
    playerAmounts[3] = 100;
    update_table();
  });

  // Build the next building in the game
  $("#build").click( function () {
    if (check_req(building_req, playerAmounts))
    {
      buildings_built += 1;
      for (var i = 0; i < building_req.length; i++)
      {
        playerAmounts[i] -= building_req[i];
      }

      building_req = new_building(building_req);
      var points_from_building = buildings_built*50 +150;
      var money_from_building = buildings_built*100 + 400;
      playerAmounts[4] += money_from_building;
      playerPoints += points_from_building;
      update_table();

    }
  });

  // Create requirements for next building and display them
  function new_building(prev_req)
  {
    var wood = prev_req[0] + Math.floor(Math.random()*10)+1;
    var stone = prev_req[1] + Math.floor(Math.random()*10)+1;
    var food = Math.floor(Math.random()*20+15)+1;
    var stamina = Math.floor(Math.random()*20+50)+1;
    var new_req = [wood,stone,food,stamina];

    document.getElementById("wood_req").innerHTML = wood;
    document.getElementById("stone_req").innerHTML = stone;
    document.getElementById("food_req").innerHTML = food;
    document.getElementById("stamina_req").innerHTML = stamina;
    document.getElementById("buildnum").innerHTML = buildings_built;
    return new_req;
  }

  // Check if requirements are filled to do action
  function check_req(req_list, playerAmounts)
  {
    var messages = ["Not enough wood.",
                    "Not enough stone.",
                    "Not enough food.",
                    "Not enough stamina. Go to sleep.",
                    "You are out of money!"]
    for (var i = 0; i < req_list.length; i++)
    {
      if (playerAmounts[i]-req_list[i] < 0)
      {
        var popup = document.getElementById("popup");
        popup.innerHTML = messages[i];
        return false;
      }
    }
    return true;

  }
  // Updates the table of player's stats
  function update_table() {
    var resourcelist = document.getElementById("resource_list");
    for (var i = 0; i < playerAmounts.length; i++)
    {
      resourcelist.rows[1].cells[i].innerHTML = playerAmounts[i];
    }
    var popup = document.getElementById("popup");
    popup.innerHTML = "";
    //check_if_lost(playerAmounts);

  }
  /*
  function check_if_lost(playerAmounts)
  {
    // Minimum requirements to either get food in the game or gather more
    // wood to possibly complete a building
    var popup = document.getElementById("popup");
    popup.innerHTML = "";
    if(playerAmounts[2] < 5 && playerAmounts[4] < 200)
    {
      popup.innerHTML = "You ran out of food/money and lost the game. Remember to submit your score!";
    }

  }
  */

  // Request the service to set the resolution of the
  // iframe correspondingly
  var message =  {
    messageType: "SETTING",
    options: {
      "width": 650, //Integer
      "height": 500 //Integer
      }
  };
  window.parent.postMessage(message, "*");

});
