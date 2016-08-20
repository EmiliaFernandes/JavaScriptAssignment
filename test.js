var fs = require('fs'), readline = require('readline'), stream = require('stream');


var Asian_list = ["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India", "Indonesia", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal",
"Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"];

// create read and write streams
var readMe = fs.ReadStream('Indicators.csv');
var write1 = fs.WriteStream('lineChart.json'); // json for Urban and rural population of India [1960- 2015]
var write2 = fs.WriteStream('barChart.json'); // this json for Urban + rural population of Asian Countries [1960- 2015]

var headers = [];
var count1 = 0, count2 = 0;
var countryIndex, indicatorCodeIndex;

var str = readline.createInterface({
  input: readMe,
  terminal: false
});


str.on('line', function(line) {
  if(count1==0) {
    headers=line.split(",");

    countryIndex = headers.indexOf("CountryName");
    indicatorIndex = headers.indexOf("IndicatorCode");
    write1.write("[ \n");
    write2.write("[ \n");
    count1++;
    count2++;
  }
  else {
    var currentline = line.split(",");

    if(currentline[countryIndex]==="India" && (currentline[indicatorIndex]==="SP.RUR.TOTL.ZS" || currentline[indicatorIndex]==="SP.URB.TOTL.IN.ZS")) {
      count1 = writeToFile(currentline,write1,count1); //write all records for india
    }
    // Gather the data records for Asian countries
    else if(currentline[indicatorIndex]==="SP.RUR.TOTL" || currentline[indicatorIndex]==="SP.URB.TOTL") {
      var condition = false;
      for(var i=0;i<Asian_list.length;i++) {
        if(currentline[countryIndex]===Asian_list[i]) {
          condition = true;
          break;
        }
      }
      if(condition) {
        count2 = writeToFile(currentline,write2,count2);
      }
    }
  }

}).on('close',function() {
  write1.write("]");
  write2.write("]");
});

// function to collect and write data
function writeToFile(currentline,writeStr,count) {
  var obj = {};
  var urbArray=[];
  var rurArray=[];
  for(var i=0;i<currentline.length;i++){
    obj[headers[i]] = currentline[i];
  }

  if(count1==1) {
    writeStr.write(JSON.stringify(obj));
  }
  else {
    writeStr.write(" \n \n"+JSON.stringify(obj));
  }

  count1++;
  return count1;
}
