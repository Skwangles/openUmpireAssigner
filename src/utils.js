const NULL_CSV_CONSTANT = '-'

function gameToId(info){
    if(!info) return null

    return info.Time + "|" + info.Turf
}

function umpireToId(info){
    if(!info) return null
    
    return info.name + "|" + info.skillLevel
}

function convertJsonToCsv(json){
const items = json
const replacer = (key, value) => value === null ? NULL_CSV_CONSTANT : value // specify how you want to handle null values here
const header = Object.keys(items[0])
const csv = [
  header.join(','), // header row first
  ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
].join('\r\n')
return csv
}

function convertCsvToJson(csv, currentGames){
    try{
    var lines=csv.split("\n");
  
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j].replaceAll('"', '') === NULL_CSV_CONSTANT ? null : currentline[j].replaceAll('"', '') ;
        }
  
        result.push(obj);
  
    }
   //return result; //JavaScript object
   return JSON.parse(JSON.stringify(result)); //JSON
    }
    catch(ex){
        console.log(ex)
        return currentGames
    }
  
 
  }

export {gameToId, umpireToId, convertCsvToJson, convertJsonToCsv}