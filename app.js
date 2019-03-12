$(function() {
  // https://stackoverflow.com/a/52539264
  // function paramsToObject(entries) {
  //   var result = {};
  //   for (let entry of entries) {
  //     // each 'entry' is a [key, value] tupple
  //     result[entry[0]] = entry[1];
  //   }
  //   return result;
  // }

  var database;

  function addTableRow(tableId, rowData) {
    // var tableSelector = `#${tableId} > tbody`;
    var tableBodySelector = "#" + tableId + " > tbody";
    $(tableBodySelector).append(`
        <tr>
          <td>${rowData.key}</td>
          <td>${rowData.name}</td>
        </tr>
      `);
  }

  function init() {
    // Initialize Firebase
    // see https://console.firebase.google.com/project/PROJECT_NAME/settings/general/
    var config = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      databaseURL: "YOUR_DATABASE_URL",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    var itemsRef = database.ref("items/");
    itemsRef.on("child_added", function(data) {
      addTableRow("item-table", {
        key: data.key,
        name: data.val().name
      });
    });

    return database;
  }

  function addItem(item) {
    var itemsRef = database.ref("items/");
    // var newItemRef = itemsRef.push(item);
    var newItemRef = itemsRef.push();
    newItemRef.set(item);
    return newItemRef.key;
  }

  function getItemById(id) {
    var itemRef = database
      .ref("items/")
      .orderByKey()
      .equalTo(id);
    itemRef.once("value", function(snapshot) {
      // var item = {};
      // snapshot.forEach(function(childSnapshot) {
      //   item = childSnapshot.val();
      // });

      var item = snapshot.child(id).val();
      if (item && item.name) {
        $("#search-item-result").text("Item found: " + item.name);
      } else {
        $("#search-item-result").text("Item not found");
      }
    });

    // return itemRef
    //   .once("value")
    //   .then(function(snapshot) {
    //     return snapshot.child(id).val();
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  }

  $("#item-add-form").on("submit", function(event) {
    event.preventDefault();
    // var form = $(this);
    // var params = new URLSearchParams(form.serialize());
    // var item = paramsToObject(params);
    var itemName = $("#item-name")
      .val()
      .trim();
    var key = addItem({ name: itemName });
    console.log("Item added -- key:", key);
    this.reset();
  });

  $("#item-search-form").on("submit", function(event) {
    event.preventDefault();
    var itemId = $("#item-id")
      .val()
      .trim();
    getItemById(itemId);

    // getItemById(itemId)
    //   .then(function(item) {
    //     if (item && item.name) {
    //       $("#search-item-result").text("Item found: " + item.name);
    //     } else {
    //       $("#search-item-result").text("Item not found");
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });

    this.reset();
  });

  database = init();
});
