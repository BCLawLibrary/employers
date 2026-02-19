//Get any search parameters from the URL
function getURLParameter(name) {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
        location.search
      ) || [, ""])[1].replace(/\+/g, "%20")
    ) || ""
  );
}

myKey = getURLParameter("key");

$(document).ready(function () {
  //Employer Table
  var employerTable = $("#employerData").DataTable({
    dom: "tr",
    ajax: {
      // Pull data from Google Sheet via Sheets API v4
      url: "https://sheets.googleapis.com/v4/spreadsheets/1p9bo65Y4LUbZPDJPeFhwEepdmydcx5qDZC_Oxeq-A4Q/values/Sheet1!A:D?key=AIzaSyD8Y28YJpVhE4XlVlOoA74Ws47YdPz5nGA",
      cache: true,
      dataSrc: function (json) {
        var myData = json["values"];
        myData = myData.map(function (n) {
          myObject = {
            employer: n[0],
            state: n[1],
            region: n[2],
            country: n[3],
          };
          return myObject;
        });
        myData.splice(0, 1);
        return myData;
      },
    }, // END ajax
    deferRender: true,
    columns: [
      { data: "employer" },
      { data: "state" },
      { data: "region" },
      { data: "country" },
    ],
    order: [
      [3, "desc"],
      [1, "asc"],
      [0, "asc"],
    ],
    pageLength: 999,

    columnDefs: [{ targets: [1, 2, 3], visible: false }],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows({ page: "current" }).nodes();
      var last = null;

      api
        .column(1, { page: "current" })
        .data()
        .each(function (group, i) {
          if (last !== group) {
            $(rows)
              .eq(i)
              .before(
                '<th colspan="1" class="group"><strong>' +
                  group +
                  "</strong></th>"
              );

            last = group;
          }
        });

      if ($("ul#left-list").is(":empty")) {
        var subjectList = api
          .columns(1, { search: "applied" })
          .data()
          .eq(0) // Reduce the 2D array into a 1D array of data
          .sort() // Sort data alphabetically
          .unique(); // Reduce to unique values

        var cList = $("ul#left-list");
        $.each(
          subjectList,
          function (
            i //create subject menu
          ) {
            var li = $("<li/>").appendTo(cList);
            var span = $("<span/>")
              .addClass("btn btn-default btn-gold stateSearch")
              .text(subjectList[i])
              .appendTo(li);
          }
        );
        $("span.stateSearch").click(function () {
          $("#left-list span, .all").removeClass("selected");
          $(this).addClass("selected");

          var search = "^" + $(this).text() + "$";
          tables.column(1).search("");
          tables.column(2).search("");
          tables.search("");
          tables.column(1).search(search, true, false).draw();
        });
      }
    }, //end drawCallBack
  });

  var tables = $(".dataTable").DataTable(); //Needed to let inputs controll all tables

  //Region buttons - top menu
  $("span.regionSearch").click(function () {
    $("#top-menu span").removeClass("selected");
    $(this).addClass("selected");

    var search = "^" + $(this).text() + "$";
    tables.column(1).search("");
    tables.column(2).search("");
    tables.search("");
    tables.column(2).search(search, true, false).draw();

    $("ul#left-list").html("");
    var subjectList = employerTable
      .columns(1, { search: "applied" })
      .data()
      .eq(0) // Reduce the 2D array into a 1D array of data
      .sort() // Sort data alphabetically
      .unique(); // Reduce to unique values

    var cList = $("ul#left-list");
    $.each(
      subjectList,
      function (
        i //create subject menu
      ) {
        var li = $("<li/>").appendTo(cList);
        var span = $("<span/>")
          .addClass("btn btn-default btn-gold stateSearch")
          .text(subjectList[i])
          .appendTo(li);
      }
    );
    $("span.stateSearch").click(function () {
      $("#left-list span").removeClass("selected");
      $(this).addClass("selected");
      var search = "^" + $(this).text() + "$";
      tables.column(1).search("");
      tables.column(2).search("");
      tables.search("");
      tables.column(1).search(search, true, false).draw();
    });
  });
  //All button to clear search
  $("span.all").click(function () {
    $("#top-menu span").removeClass("selected");
    $(this).addClass("selected");

    tables.column(1).search("");
    tables.column(2).search("");
    tables.search("").draw();

    $("ul#left-list").html("");
    var subjectList = employerTable
      .columns(1, { search: "applied" })
      .data()
      .eq(0) // Reduce the 2D array into a 1D array of data
      .sort() // Sort data alphabetically
      .unique(); // Reduce to unique values

    var cList = $("ul#left-list");
    $.each(
      subjectList,
      function (
        i //create subject menu
      ) {
        var li = $("<li/>").appendTo(cList);
        var span = $("<span/>")
          .addClass("btn btn-default btn-gold stateSearch")
          .text(subjectList[i])
          .appendTo(li);
      }
    );
    $("span.stateSearch").click(function () {
      $("#left-list span, .all").removeClass("selected");
      $(this).addClass("selected");
      var search = "^" + $(this).text() + "$";
      tables.column(1).search("");
      tables.column(2).search("");
      tables.search("");
      tables.column(1).search(search, true, false).draw();
    });
  });

  if (myKey.length > 0) {
    tables.search(myKey).draw();
    $("#myInput").val(myKey);
  }

  // #myInput is a <input type="text"> element
  $("#myInput").on("keyup", function () {
    tables.search(this.value).draw();
  });
});
