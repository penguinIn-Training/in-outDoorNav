/* eslint-disable no-undef */
'use strict';
console.log('Hi');

// Grid layer
var graticule = new ol.layer.Graticule({ 
  // the style to use for the lines, optional.
  strokeStyle: new ol.style.Stroke({
    color: 'rgba(207, 0, 15, 1)',
    width: 2,
    lineDash: [0.5, 4],
  }),
  showLabels: true,
  visible: false,
  wrapX: false,
});
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////Define the map for///////////////////////////////

var map = new ol.Map({
  interactions: ol.interaction.defaults().extend([new ol.interaction.DragRotateAndZoom()]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    graticule,
  ],
  target: 'map',
  view: new ol.View({
    projection: 'EPSG:3857',
    // center: [-5639523.95, -3501274.52],
    center: [3992579.250256516, 3760172.928780113],
    zoom: 19,
    // minZoom: 2,
    // maxZoom: 19,
  }),
});

// Change from mercator to lon/lat
var meters2degress = function(x,y) {
  var lon = x *  180 / 20037508.34 ;
  // thanks magichim @ github for the correction
  var lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90; 
  return [lon, lat];
};

map.on('click',function(e){
  console.log('Coordinate in Mercator: ',e.coordinate);
  console.log('Coordinate in LON|LAT',meters2degress(e.coordinate[0],e.coordinate[1]));
  map.forEachFeatureAtPixel(e.pixel,function(feature,layer){
    console.log('Feature: just take the number for ID',feature.getProperties());
    if(feature.values_.name.split(' ')[0] != 'poi'){
      $('#from').val(feature.values_.name.split(' ')[1]); 
    }else{
      $('#to').val(feature.values_.name.split(' ')[1]); 
    }
  });});
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////Change map terrain///////////////////////////////

const openStreetMapStandard = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible:true,
  title: 'openStreetMapStandard',
});

const openStreetMapHumanitarian = new ol.layer.Tile({
  source: new ol.source.OSM({
    url:'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  }),
  visible:false,
  title: 'openStreetMapHumanitarian',
});

const stamenTerrain = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
    attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
  }),
  visible:false,
  title: 'stamenTerrain',
});

const sateliteTerrain = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
  }),
  visible:false,
  title: 'sateliteTerrain',
});

const bingSateliteTerrain = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: 'AvULmzfOTcs6LuAIaoZhatEkngR7N1X1wwaxoOHqN-QEIbDkY6HWGd23_04Abynr',
    imagerySet: 'AerialWithLabelsOnDemand',
    // use maxZoom 19 to see stretched tiles instead of the BingMaps
    // "no photos at this zoom level" tiles
    // maxZoom: 19
  }),
  visible:false,
  title: 'bingSateliteTerrain',
});

// layer group 
const baseLayerGroup = new ol.layer.Group({
  layers:[
    openStreetMapStandard,openStreetMapHumanitarian,stamenTerrain,sateliteTerrain,bingSateliteTerrain,
  ],
});
map.addLayer(baseLayerGroup);//layer activation

// Layer Switcher
const baseLayerElements=document.querySelectorAll('.sidebar > input[type=radio]'); // select all children "type radio" for sidbar div
for(let baseLayerElement of baseLayerElements){
  baseLayerElement.addEventListener('change',function(e){
    e.preventDefault();
    // console.log('here1');
    var allCheckbox = document.getElementById('all-checkbox');
    let baseLayerElementValue = this.value; 
    if('Sec-Layer' == baseLayerElementValue){
      allCheckbox.style.display = 'block';
    }
    else
    {
      allCheckbox.style.display = 'none';
    }
    baseLayerGroup.getLayers().forEach(function(ele,i,arr)
    {let baseLayerTitle = ele.get('title');
      ele.setVisible(baseLayerTitle === baseLayerElementValue);
    });
  });
}
////////////////////////////////////////////////////////////////////////////////


/////////////////////TO make GeoImage "Geo Refferance layer/////////////////////

/**
 * TO make GeoImage "Geo Refferance layer"
 */

$('.option,#type').on('change', resetSource);
// var x = Number($('#x').val());
// var y = Number($('#y').val());
// var sx = Number($('#w').val());
// var sy = Number($('#h').val());
// var xmin = Number($('#xmin').val());
// var ymin = Number($('#ymin').val());
// var xmax = Number($('#xmax').val());
// var ymax = Number($('#ymax').val());
// var selectedFloor='';
// // $('#type').on('change', ()=>{selectedFloor =$('#type').val();
// var url='./data/Waseela.jpg';
// if(selectedFloor=='floor1'){
//   url='./data/PenguinIN.jpg';
//   sx=0.00441176470588235;
//   sy=0.00441176470588235;
//   x=3992579.250256516;
//   y=3760172.928780113;
// }else if(selectedFloor=='floor2'){
//   url='./data/Waseela.jpg';
//   sx=0.0155172413793103;
//   sy=0.0155172413793103;
//   x=3992581.25025652;
//   y=3760166.92878011;
// }
// console.log('selectedFloor',selectedFloor);
// var geoimg = new ol.layer.GeoImage({
//   name: 'Georef',
//   opacity: .7,
//   source: new ol.source.GeoImage({
//     url: url,
//     imageCenter: [x,y],
//     imageScale: [sx,sy],
//     imageCrop: [xmin,ymin,xmax,ymax],
//     //imageMask: [[273137.343,6242443.14],[273137.343,6245428.14],[276392.157,6245428.14],[276392.157,6242443.14],[273137.343,6242443.14]],
//     imageRotate: Number($('#rotate').val()*Math.PI/180),
//     projection: 'EPSG:3857',
//     attributions: [ '<a href=\'http://www.geoportail.gouv.fr/actualite/181/telechargez-les-cartes-et-photographies-aeriennes-historiques\'>Photo historique &copy; IGN</a>' ],
//   }),
// });map.addLayer(geoimg);
// // });





function resetSource () {
  map.getLayers().forEach(layer => {
    if (layer && layer.get('name') === 'Georef') {
      map.removeLayer(layer);
      
    }
  });
  // console.log('here2');
  var x = Number($('#x').val());
  var y = Number($('#y').val());
  var sx = Number($('#w').val());
  var sy = Number($('#h').val());
  var xmin = Number($('#xmin').val());
  var ymin = Number($('#ymin').val());
  var xmax = Number($('#xmax').val());
  var ymax = Number($('#ymax').val());
  // var angleRotate = Number($('#rotate').val());
  // let angle = -270 + angleRotate;

  var selectedFloor='';
  selectedFloor =$('#type').val();
  // $('#type').on('change', ()=>{selectedFloor =$('#type').val();
  var url='';
  if(selectedFloor=='floor1'){
    url='./data/PenguinINZoom1.png';
    sx=0.00441176470588235;
    sy=0.00441176470588235;
    x=3992579.250256516;
    y=3760172.928780113;
  }else if(selectedFloor=='floor2'){
    url='./data/WaseelaZoom1.png';
    sx=0.0155172413793103;
    sy=0.0155172413793103;
    x=3992580.25025652;
    y=3760167.92878011;
  }
  console.log('selectedFloor',selectedFloor);
  var geoimg = new ol.layer.GeoImage({
    name: 'Georef',
    opacity: .7,
    minZoom:18,
    maxZoom:21,
    source: new ol.source.GeoImage({
      url: url,
      imageCenter: [x,y],
      imageScale: [sx,sy],
      imageCrop: [xmin,ymin,xmax,ymax],
      //imageMask: [[273137.343,6242443.14],[273137.343,6245428.14],[276392.157,6245428.14],[276392.157,6242443.14],[273137.343,6242443.14]],
      imageRotate: Number($('#rotate').val()*Math.PI/180),
      projection: 'EPSG:3857',
      attributions: [ '<a href=\'http://www.geoportail.gouv.fr/actualite/181/telechargez-les-cartes-et-photographies-aeriennes-historiques\'>Photo historique &copy; IGN</a>' ],
    }),
  });



  geoimg.getSource().setCenter([x,y]);
  geoimg.getSource().setRotation($('#rotate').val()*Math.PI/180);
  geoimg.getSource().setScale([sx,sy]);
  geoimg.getSource().setCrop([xmin,ymin,xmax,ymax]);

  // pointer2.setGeometry(new ol.geom.Point(([3992566.263943126+.004*(Number(ele.Y1)*Math.cos(angle*Math.PI/180)+ Number(ele.X1)*Math.sin(angle*Math.PI/180) )  , 3760166.192932204+.004*(Number(ele.X1)*Math.cos(angle*Math.PI/180)- Number(ele.Y1)*Math.sin(angle*Math.PI/180) )])));
  // var crop = geoimg.getSource().getCrop();
  // $('#xmin').val(crop[0]);
  // $('#ymin').val(crop[1]);
  // $('#xmax').val(crop[2]);
  // $('#ymax').val(crop[3]); 

  map.getLayers().forEach(layer => {
    if (layer && layer.get('name') === 'Georef') {
      map.removeLayer(layer);
      
    }
  });


  selectedFloor='';
  selectedFloor =$('#type').val();
  // $('#type').on('change', ()=>{selectedFloor =$('#type').val();
  url='';
  if(selectedFloor=='floor1'){
    url='./data/PenguinIN.png';
    sx=0.00441176470588235;
    sy=0.00441176470588235;
    x=3992579.250256516;
    y=3760172.928780113;
  }else if(selectedFloor=='floor2'){
    url='./data/Waseela.png';
    sx=0.0155172413793103;
    sy=0.0155172413793103;
    x=3992580.25025652;
    y=3760167.92878011;
  }
  console.log('selectedFloor',selectedFloor);
  var geoimg1 = new ol.layer.GeoImage({
    name: 'Georef',
    opacity: .7,
    minZoom:21,
    source: new ol.source.GeoImage({
      url: url,
      imageCenter: [x,y],
      imageScale: [sx,sy],
      imageCrop: [xmin,ymin,xmax,ymax],
      //imageMask: [[273137.343,6242443.14],[273137.343,6245428.14],[276392.157,6245428.14],[276392.157,6242443.14],[273137.343,6242443.14]],
      imageRotate: Number($('#rotate').val()*Math.PI/180),
      projection: 'EPSG:3857',
      attributions: [ '<a href=\'http://www.geoportail.gouv.fr/actualite/181/telechargez-les-cartes-et-photographies-aeriennes-historiques\'>Photo historique &copy; IGN</a>' ],
    }),
  });
  map.addLayer(geoimg1);
  map.addLayer(geoimg);
  printPoints();
}
resetSource () ;

// Show extent in the layerswitcher
map.addControl(new ol.control.LayerSwitcher({ extent:true }));
// map.on('click',function(e){  geoimg.getSource().setCenter([e.coordinate[0],e.coordinate[1]]);});
////////////////////////////////////////////////////////////////////////////////



//////////////////////////Draw in  map with diff zoom///////////////////////////

// const fillStyle=new ol.style.Fill({
//   color: [84,118,255,1],
// });

// const strokeStyle=new ol.style.Stroke({
//   color: [46,45,45,1],
//   width:1.2,
// });

// const circleStyle = new ol.style.Circle({
//   fill: new ol.style.Fill({
//     color:[245,49,5,1],
//   }),
//   radius: 7,
//   stroke: strokeStyle,
// });

// const penguinInLayer = new ol.layer.VectorImage({
//   source: new ol.source.Vector({
//     url: './data/vector_data/map.geojson',
//     format: new ol.format.GeoJSON(),
//   }),
//   visible: true,
//   maxZoom:40,
//   minZoom:18,
//   // projection: 'EPSG:3857',
//   title:'penguinInLayer',
//   style: new ol.style.Style({
//     fill:fillStyle,
//     stroke:strokeStyle,
//     image:circleStyle,
//   }),
// });
// map.addLayer(penguinInLayer);

// const penguinInLayerDetails = new ol.layer.VectorImage({
//   source: new ol.source.Vector({
//     url: './data/vector_data/map1.geojson',
//     format: new ol.format.GeoJSON(),
//   }),
//   visible: true,
//   maxZoom:40,
//   minZoom:21,
//   // projection: 'EPSG:3857',
//   title:'penguinInLayerDetails',
// });
// map.addLayer(penguinInLayerDetails);
////////////////////////////////////////////////////////////////////////////////



/////////////////////////This is t handle search process////////////////////////

var queryInput = document.getElementById('epsg-query'); //for search
var searchButton = document.getElementById('epsg-search');//for search
var resultSpan = document.getElementById('epsg-result');//for search
var renderEdgesCheckbox = document.getElementById('render-edges');// for grid
var showGraticuleCheckbox = document.getElementById('show-graticule');// for grid

/**
 * This is t handle search process
 * @param {fuction} query 
 */
function search(query) {
  resultSpan.innerHTML = 'Searching ...';
  // console.log(query);
  fetch(`https://eu1.locationiq.com/v1/search.php?key=d4328e89827d71&q=${query}&format=json`)
    .then(function (response) {
      // console.log('sadsadasdsadasd',response);
      return response.json();
    })
    .then(function (json) {
      var results = json[0];
      // console.log(results);
      var pointer = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([results.lon, results.lat])),
      });
      // console.log(pointer,'@@@@@@@');
      pointer.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            color: '#BADA55',
            crossOrigin: 'anonymous',
            // For Internet Explorer 11
            imgSize: [20, 20],
            src: 'data/dot.svg',
          }),
        }),
      );
      var vectorSource = new ol.source.Vector({
        features: [pointer],
      });
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
      });
      
      map.addLayer(vectorLayer);//layer activation
      map.setView(new ol.View({
        center: ol.proj.fromLonLat([results.lon,results.lat]),
        zoom: 17,
      }));

      resultSpan.innerHTML =results.display_name ;          
    });
}
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////Handle click event///////////////////////////////

/** 
 * Handle click event.
 * @param {Event} event The event.
 */
searchButton.onclick = function (event) {
  search(queryInput.value);
  event.preventDefault();
};
////////////////////////////////////////////////////////////////////////////////


//////////////////////////Handle checkbox change event//////////////////////////

/**
 * Handle checkbox change event.
 */
renderEdgesCheckbox.onchange = function () {
  // console.log('here3');
  map.getLayers().forEach(function (layer) {
    if (layer instanceof ol.layer.Tile) {
      var source = layer.getSource();
      if (source instanceof ol.source.TileImage) {
        source.setRenderReprojectionEdges(renderEdgesCheckbox.checked);
      }
    }
  });
};
////////////////////////////////////////////////////////////////////////////////



//////////////////////////Handle checkbox change event//////////////////////////

/**
 * Handle checkbox change event.
 */
showGraticuleCheckbox.onchange = function () {
  // console.log('here4');
  graticule.setVisible(showGraticuleCheckbox.checked);
};
////////////////////////////////////////////////////////////////////////////////


/////////////////////Handle collecting edges and draw nodes/////////////////////
/**
 * Handle collecting edges and draw nodes.
 */
let coordinateForPath=[];

function printPoints(){
  superagent
    .post('/edges')
    .send({'FloorIDs':'2','LastUpdateDate':'2018-02-13'}) // sends a JSON post body
    .set('X-API-Key', 'foobar')
    .set('accept', 'json')
    .end((err, res) => {
      res.body.GetFloorsEdgesResult.forEach((ele,i)=>{
        if(ele.FloorID == 2){
          AddPoint(ele.X1,ele.Y1,ele.ID);
          AddPoint(ele.X2,ele.Y2,ele.ID);
          // if(!(coordinateForPath.includes([ele.X1,ele.Y1]))){
          coordinateForPath[ele.ID]=[[ele.X1,ele.Y1],[ele.X2,ele.Y2]];
          // }
        }
      });   
      // console.log(coordinateForPath,'coordinateForPath');
    });
}
let checkExistentArray=[];
function AddPoint(X,Y,ID){
  if(!checkExistentArray.includes(`${X}`+ `${Y}`)){
    checkExistentArray.push(`${X}`+`${Y}`);
    // console.log('checkExistentArraycheckExistentArray');
    var angleRotate = Number($('#rotate').val());
    let angle = (-270 + angleRotate)*Math.PI/180;
    let scale =0.00441176470588235;
    let xCoord=3992566.263943126;
    let yCoord=3760166.192932204;
    let pointer3 = new ol.Feature({
      geometry: new ol.geom.Point(([xCoord+scale*(Number(Y)*Math.cos(angle)+ Number(X)*Math.sin(angle) )  , yCoord+scale*(Number(X)*Math.cos(angle)- Number(Y)*Math.sin(angle) )])),
      name:`point ${ID}`,
    });
    pointer3.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          color: '#2b95db',
          crossOrigin: 'anonymous',
          // For Internet Explorer 11
          imgSize: [20, 20],
          src: 'data/dot.svg',
        }),
      }),
    );
    let vectorSource3 = new ol.source.Vector({
      features: [pointer3],

    });
    let vectorLayer3 = new ol.layer.Vector({
      source: vectorSource3,
      name:'vectorSource3',
      maxZoom:40,
      minZoom:23,
    });
    // console.log(map.getLayers(vectorLayer2),'layer');
    map.addLayer(vectorLayer3);//layer activation 
  }}

////////////////////////////////////////////////////////////////////////////////


/////////////////////Find shortest path in-door and draw it////////////////////
/**
 * Find shortest path and draw it
 */
async function  findPath(path,yes){
  let finalPathArray=[];
  var newArray=[];
  var reutunedArray=[];
  // console.log('paaaaaaaaaaaaaaaaaaaaaaaath',coordinateForPath[path[0]]);
  await fetch('/shortestpath', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({      'x1':coordinateForPath[path[0]][0][0],
      'y1':coordinateForPath[path[0]][0][1],
      'sFloorID':'2',
      'EdgeID' : path[0],
      'destPoIId':path[1],
      'UserID':'Majd',
      'HandicapUser':'false'}),
  })
    .then((response) => response.json())
  //Then with the data from the response in JSON...
    .then((res) => {
      map.getLayers().forEach(layer => {
        if (layer && layer.get('name') === 'vectorLayer3') {
          map.removeLayer(layer);
        }});
      let val1 =Math.abs(coordinateForPath[res.getPathToPoIResult[1]][0][0] - coordinateForPath[path[0]][0][0]) + Math.abs(coordinateForPath[res.getPathToPoIResult[1]][0][1] - coordinateForPath[path[0]][0][1]);
      let val2 =Math.abs(coordinateForPath[res.getPathToPoIResult[1]][0][0] - coordinateForPath[path[0]][1][0]) +Math.abs(coordinateForPath[res.getPathToPoIResult[1]][0][1] - coordinateForPath[path[0]][1][1]);
      if(val1 < val2){
        finalPathArray.push(coordinateForPath[path[0]][1]);
        finalPathArray.push(coordinateForPath[path[0]][0]);
      }else{
        finalPathArray.push(coordinateForPath[path[0]][0]);
        finalPathArray.push(coordinateForPath[path[0]][1]);
      }
      res.getPathToPoIResult.forEach((ele,i)=>{
        let val = finalPathArray[finalPathArray.length - 1][0];
        if(i != 0 && coordinateForPath[ele] != undefined){
          if(Math.abs(val- coordinateForPath[ele][0][0]) > Math.abs(val - coordinateForPath[ele][1][0])){
            finalPathArray.push(coordinateForPath[ele][1]);
            finalPathArray.push(coordinateForPath[ele][0]);
          }else{
            finalPathArray.push(coordinateForPath[ele][0]);
            finalPathArray.push(coordinateForPath[ele][1]);
          }
        }
        // console.log('finalPathArray',finalPathArray);
      });
      // console.log('finalPathArray',finalPathArray);
      var arr = [];
      var angleRotate = Number($('#rotate').val());
      let angle = (-270 + angleRotate)*Math.PI/180;
      let scale =0.00441176470588235;
      let xCoord=3992566.263943126;
      let yCoord=3760166.192932204;
      finalPathArray.forEach((ele,i)=>{
        arr.push([xCoord+scale*(Number(ele[1])*Math.cos(angle)+ Number(ele[0])*Math.sin(angle) )  , yCoord+scale*(Number(ele[0])*Math.cos(angle)- Number(ele[1])*Math.sin(angle) )]);
      });
      // console.log('finalPathArrayhereeeeee',arr);
      finalPathArray = arr;
      var coordinates =finalPathArray;
      // console.log(coordinates,'coordinatescoordinates');
      var meters2degress = function(x,y) {
        var lon = x *  180 / 20037508.34 ;
        //thanks magichim @ github for the correction
        var lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90; 
        return [lon, lat];
      };
      coordinates.forEach((e,i)=>{
        let arrnew = meters2degress(e[0],e[1]);
        newArray.push(arrnew[1],arrnew[0]);
        reutunedArray.push(arrnew[1],arrnew[0]);
      });
      // console.log(newArray,'newArraynewArrayhere');
      // reutunedArray=newArray;
      if(yes){
        var polyline=ol.format.Polyline.encodeDeltas(
          newArray,
          2,1e6,
        );
        // console.log(newArray,'newArraynewArray');
        // console.log(polyline);
        var route = /** @type {import("../src/ol/geom/LineString.js").default} */ (new ol.format.Polyline(
          {
            factor: 1e6,
          },
        ).readGeometry(polyline, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        }));

        //0: -5751733.504402943
        //1: -3317367.02757665

        // coordinates.unshift(getLocation());
        // console.log('coordinates',coordinates);
      
        var routeCoords = route.getCoordinates();
        // console.log('routeCoords', routeCoords);
        var routeLength = routeCoords.length;
        // console.log('route', route);
        var routeFeature = new ol.Feature({
          type: 'route',
          geometry: route,
        });
        var geoMarker = /** @type Feature<import("../src/ol/geom/Point").default> */ (new ol.Feature(
          {
            type: 'geoMarker',
            geometry: new ol.geom.Point(routeCoords[0]),
          },
        ));
        var startMarker = new ol.Feature({
          type: 'icon',
          geometry: new ol.geom.Point(routeCoords[0]),
        });
        var endMarker = new ol.Feature({
          type: 'icon',
          geometry: new ol.geom.Point(routeCoords[routeLength - 1]),
        });

        var styles = {
          route: new ol.style.Style({
            stroke: new ol.style.Stroke({
              width: 6,
              color: [237, 212, 0, 0.8],
            }),
          }),
          icon: new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: 'data/icon.png',
            }),
          }),
          geoMarker: new ol.style.Style({
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({ color: 'rgb(43, 149, 219)' }),
              stroke: new ol.style.Stroke({
                color: 'white',
                width: 2,
              }),
            }),
          }),
        };


        var vectorLayer3 = new ol.layer.Vector({
          name:'vectorLayer3',
          source: new ol.source.Vector({
            features: [routeFeature, geoMarker, startMarker, endMarker],
          }),
          style: function (feature) {
            return styles[feature.get('type')];
          },
        });

        map.getLayers().forEach(layer => {
          if (layer && layer.get('name') === 'vectorLayer4') {
            map.removeLayer(layer);
            
          }});
        map.addLayer(vectorLayer3);//layer activation
      }
    });
  return reutunedArray;
}
////////////////////////////////////////////////////////////////////////////////


//////////////////specify user location when start application//////////////////

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   }
// }
// getLocation();
// function showPosition(position) {
//   // console.log([position.coords.latitude,position.coords.longitude],'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

//   var myLocationPointer = new ol.Feature({
//     geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude,position.coords.latitude])),
//   });
//   // console.log(pointer,'@@@@@@@');
//   myLocationPointer.setStyle(
//     new ol.style.Style({
//       image: new ol.style.Icon({
//         color: '#BADA55',
//         crossOrigin: 'anonymous',
//         // For Internet Explorer 11
//         imgSize: [20, 20],
//         src: 'data/dot.svg',
//       }),
//     }),
//   );
//   var vectorSource = new ol.source.Vector({
//     features: [myLocationPointer],
//   });
//   var myLocationLayer = new ol.layer.Vector({
//     source: vectorSource,
//   });

//   map.addLayer(myLocationLayer);//layer activation
// }
var poiData={};
////////////////////////////////////////////////////////////////////////////////


/////////////////////Handle collecting POI's and draw them//////////////////////
/**
 * Handle collecting POI's and draw them
 */
function gitAllPoi(){
  superagent
    .post('/gitallpoi')
    .send({ 'LastUpdateDate': '2018-02-13', 'FloorID': '2' }) // sends a JSON post body
    .set('X-API-Key', 'foobar')
    .set('accept', 'json')
    .end((err, res) => {
      // console.log(res.body.getPoIByFloorResult,'gitAllPoi'); 
      var angleRotate = Number($('#rotate').val());
      let angle = (-270 + angleRotate)*Math.PI/180;
      let scale =0.00441176470588235;
      let xCoord=3992566.263943126;
      let yCoord=3760166.192932204;
      var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857',
          },
        },
        'features': [],
      };
      res.body.getPoIByFloorResult.forEach((ele)=>{
        poiData[ele.ID]=ele.ZonePoints.split('#').map((ele1)=>
        {   
          let arr = ele1.split(',');
          return [xCoord+scale*(Number(arr[1])*Math.cos(angle)+ Number(arr[0])*Math.sin(angle) )  , yCoord+scale*(Number(arr[0])*Math.cos(angle)- Number(arr[1])*Math.sin(angle) )];
        });
        geojsonObject.features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [poiData[ele.ID]],
          },
          'properties': {'name': `poi ${ele.ID}`},
        });
      });
      var styles = [
        /* We are using two different styles for the polygons:
         *  - The first style is for the polygons themselves.
         *  - The second style is to draw the vertices of the polygons.
         *    In a custom `geometry` function the vertices of a polygon are
         *    returned as `MultiPoint` geometry, which will be used to render
         *    the style.
         */
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1,
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
          text :new ol.style.Text({
            text: 'Office',
            font: '12px Calibri,sans-serif',
            weight:'Bold',
            fill: new ol.style.Fill({ color: '#000' }),
            stroke: new ol.style.Stroke({
              color: '#D3D3D3', width: 10,
            }),
            offsetX: 30,
            offsetY: -25,
            rotation: 0,
          }),

        }),
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 2,
            fill: new ol.style.Fill({
              color: 'orange',
            }),
          }),
          geometry: function (feature) {
            // return the coordinates of the first ring of the polygon
            var coordinates = feature.getGeometry().getCoordinates()[0];
            return new ol.geom.MultiPoint(coordinates);
          },
        }) ];

      // console.log(geojsonObject);
      var source = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojsonObject),
      });
      
      var layer = new ol.layer.Vector({
        source: source,
        style: styles,
        minZoom: 22,
      });
      map.addLayer(layer);

    });}

gitAllPoi();

$('#submit').on('click', getpath);
function getpath(){
  var edgeID = Number($('#from').val());
  var distpoi = Number($('#to').val());
  findPath([edgeID,distpoi],true);
}



////////////////////////////////////////////////////////////////////////////////


///////////////////////////////In-Out door navigation//////////////////////////////
/**
 * Out door navigation
 */
var outnavInput = document.getElementById('outnav-input'); //for search
var secPointInput = document.getElementById('secPoint-input'); //for search
var poiInput = Number($('#poi-input').val()); //for search

var edgeID = Number($('#from').val()); //for search
var outnavButton = document.getElementById('outnav-button');//for search
var outnavResult = document.getElementById('outnav-result');//for search  

// console.log('poiInputpoiInputpoiInput',poiInput);

async function Outdoor(query,query2) {
  resultSpan.innerHTML = 'Searching ...';
  // console.log(query);
  
  fetch(`https://eu1.locationiq.com/v1/search.php?key=d4328e89827d71&q=${query}&format=json`)
    .then(function (response) {
      // console.log('sadsadasdsadasd',response);
      return response.json();
    })
    .then(function (json) {
      var results = json[0];
      // console.log(results);
      var pointer = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([results.lon, results.lat])),
      });
      // console.log(pointer,'@@@@@@@');
      pointer.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            color: '#BADA55',
            crossOrigin: 'anonymous',
            // For Internet Explorer 11
            imgSize: [20, 20],
            src: 'data/dot.svg',
          }),
        }),
      );
      var vectorSource = new ol.source.Vector({
        features: [pointer],
      });
      var vectorLayer = new ol.layer.Vector({
        name:'vectorLayer5',
        source: vectorSource,
      });
      map.getLayers().forEach(layer => {
        if (layer && layer.get('name') === 'vectorLayer5') {
          map.removeLayer(layer);
          
        }});
      
      map.addLayer(vectorLayer);//layer activation
      // map.setView(new ol.View({
      //   center: ol.proj.fromLonLat([results.lon,results.lat]),
      //   zoom: 17,
      // }));

      outnavResult.innerHTML =results.display_name ;          

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        }
      }
      getLocation();
      async function showPosition(position) {
        // console.log([position.coords.latitude,position.coords.longitude],'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      
        var myLocationPointer = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude,position.coords.latitude])),
        });
        // console.log(pointer,'@@@@@@@');
        myLocationPointer.setStyle(
          new ol.style.Style({
            image: new ol.style.Icon({
              color: '#BADA55',
              crossOrigin: 'anonymous',
              // For Internet Explorer 11
              imgSize: [20, 20],
              src: 'data/dot.svg',
            }),
          }),
        );
        var vectorSource = new ol.source.Vector({
          features: [myLocationPointer],
        });
        var myLocationLayer = new ol.layer.Vector({
          name: 'vectorLayer5',
          source: vectorSource,
        });
        map.getLayers().forEach(layer => {
          if (layer && layer.get('name') === 'vectorLayer5') {
            map.removeLayer(layer);
            
          }});
        map.addLayer(myLocationLayer);//layer activation
        //https://router.project-osrm.org/route/v1/driving/35.557818,31.5833556;13.388860,52.517037?alternatives=false&annotations=nodes
        //http://router.project-osrm.org/route/v1/driving/${position.coords.longitude},${position.coords.latitude};${results.lon},${results.lat}?alternatives=false&annotations=nodes
        //http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false
        //http://router.project-osrm.org/route/v1/driving/${position.coords.longitude},${position.coords.latitude};${results.lon},${results.lat}?overview=false
        async function  url(){
          if(query2){
            // console.log('query2query2query2query2',query2);
            const response1 = await fetch(`https://eu1.locationiq.com/v1/search.php?key=d4328e89827d71&q=${query2}&format=json`);
            const json1 =await response1.json(); 
            const results1 = json1[0];
            return `https://router.project-osrm.org/route/v1/driving/${position.coords.longitude},${position.coords.latitude};${results1.lon},${results1.lat};${results.lon},${results.lat}?alternatives=true&overview=full&annotations=nodes&geometries=geojson`;
          }else {
            // console.log('hellllllllllllllllllllllllllllllllllllllllloooooooooooooooooooooooooooooooooooooooooooooooo');
            return `https://router.project-osrm.org/route/v1/driving/${position.coords.longitude},${position.coords.latitude};${results.lon},${results.lat}?alternatives=true&overview=full&annotations=nodes&geometries=geojson`;
          }
        }

        // console.log('urlurlurlurlurlurlurl',await url());
        fetch( await url())
          .then(function (response) {
            // console.log('sadsadasdsadasd',response);
            return response.json();
          })
          .then(async function (json) {
            var finalCoord=[];
            // console.log('jsonjsonjson',json);
            // console.log(json.routes[0].geometry.coordinates);
            // console.log(json.routes[0].legs[0].annotation.nodes);
            var results = json.routes[0].geometry.coordinates; 
            results.forEach((ele)=>{
              finalCoord.push(ele[1],ele[0]);
            });
            var indoorPath =await findPath([edgeID,poiInput]);
            // console.log('resultsresults',indoorPath,finalCoord);
            finalCoord = finalCoord.concat(indoorPath);
            var polyline=ol.format.Polyline.encodeDeltas(
              finalCoord,
              2,1e6,
            );
              // console.log(results,'resultsresultsresults');
              // console.log(polyline);
            var route = /** @type {import("../src/ol/geom/LineString.js").default} */ (new ol.format.Polyline(
              {
                factor: 1e6,
              },
            ).readGeometry(polyline, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            }));

            var routeCoords = route.getCoordinates();
            // console.log('routeCoords', routeCoords);
            var routeLength = routeCoords.length;
            // console.log('route', route);
            var routeFeature = new ol.Feature({
              type: 'route',
              geometry: route,
            });

            var geoMarker = /** @type Feature<import("../src/ol/geom/Point").default> */ (new ol.Feature(
              {
                type: 'geoMarker',
                geometry: new ol.geom.Point(routeCoords[0]),
              },
            ));

            var startMarker = new ol.Feature({
              type: 'icon',
              geometry: new ol.geom.Point(routeCoords[0]),
            });

            var endMarker = new ol.Feature({
              type: 'icon',
              geometry: new ol.geom.Point(routeCoords[routeLength - 1]),
            });

            var styles = {
              route: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  width: 6,
                  color: [237, 212, 0, 0.8],
                }),
              }),
              icon: new ol.style.Style({
                image: new ol.style.Icon({
                  anchor: [0.5, 1],
                  src: 'data/icon.png',
                }),
              }),
              geoMarker: new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 7,
                  fill: new ol.style.Fill({ color: 'rgb(43, 149, 219)' }),
                  stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 2,
                  }),
                }),
              }),
            };
            
            var vectorLayer4 = new ol.layer.Vector({
              name:'vectorLayer4',
              source: new ol.source.Vector({
                features: [routeFeature, geoMarker, startMarker, endMarker],
              }),
              style: function (feature) {
                return styles[feature.get('type')];
              },
            });

            map.getLayers().forEach(layer => {
              if (layer && layer.get('name') === 'vectorLayer4') {
                map.removeLayer(layer);
                
              }});

            map.addLayer(vectorLayer4);//layer activation
          });       
      }
    });
}


outnavButton.onclick = function (event) {
  outnavInput = document.getElementById('outnav-input'); //for search
  secPointInput = document.getElementById('secPoint-input'); //for search
  poiInput = Number($('#poi-input').val()); //for search
  edgeID = Number($('#from').val()); //for search
  Outdoor(outnavInput.value,secPointInput.value);
  event.preventDefault();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add functionality to vectors (Pop up text):
          
// map.on('click', function(cleckedArea){
//   map.forEachFeatureAtPixel(cleckedArea.pixel,function(feature,layer){
//     let clickedFeatureName = feature.get('name');
//     // let clickedFeatureAdditionalinfo = feature.get('additionalinfo');
//     console.log(clickedFeatureName,'hello');
//   });  console.log(cleckedArea.coordinate);
// });

    
// var extent = [3992801.0614873893, 3762111.5948936045, 3992879.65616761, 3762172.8669200735];

// const imageLayerToMap = new ol.layer.Image({
//   source: new ol.source.ImageStatic({
//     attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
//     url: 'https://www.autodesk.eu/content/dam/autodesk/www/products/autodesk-autocad-lt/fy20/features/images/new-dark-theme-large-1920x1048.jpg',
//     // projection: 'EPSG:4326',
//     imageExtent: extent,
//     imageSize:[0, 0],
  
//   }),
//   className:'mapy',
// });




