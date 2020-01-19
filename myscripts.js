var nodes, edges, network,
    node_counter=0,
    edge_counter=0;

function addNode() {
    try {
        nodes.add({
            id: document.getElementById('node-id').value,
            label: document.getElementById('node-label').value,
            x: 150,
            y: 150
        });
    }
    catch (err) {
        alert(err);
    }
}
function updateNode() {
    try {
        nodes.update({
            id: document.getElementById('node-id').value,
            label: document.getElementById('node-label').value
        });
    }
    catch (err) {
        alert(err);
    }
}
function removeNode() {
    try {
        nodes.remove({id: document.getElementById('node-id').value});
    }
    catch (err) {
        alert(err);
    }
}

function addEdge() {
    try {
        edges.add({
            id: document.getElementById('edge-id').value,
            from: document.getElementById('edge-from').value,
            to: document.getElementById('edge-to').value
        });
    }
    catch (err) {
        alert(err);
    }
}
function updateEdge() {
    try {
        edges.update({
            id: document.getElementById('edge-id').value,
            from: document.getElementById('edge-from').value,
            to: document.getElementById('edge-to').value
        });
    }
    catch (err) {
        alert(err);
    }
}
function removeEdge() {
    try {
        edges.remove({id: document.getElementById('edge-id').value});
    }
    catch (err) {
        alert(err);
    }
}


// convenience method to stringify a JSON object
function toJSON(obj) {
    return JSON.stringify(obj, null, 4);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function matrixArray(rows,columns){
    var arr = new Array();
    for(var i=0; i<=rows; i++){
      arr[i] = new Array();
      for(var j=0; j<=columns; j++){
        arr[i][j] = 0;//вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
      }
    }
    return arr;
}


/////////////////////////////////////////
//Добавить проверку простоты графа
//Добавление графа из матрицы смежности
//Изменить кнопки
/////////////////////////////////////////



function draw() { //rendering the page
    // create an array with nodes
    nodes = new vis.DataSet();
   /* nodes.on('*', function () {
        document.getElementById('nodes').innerHTML = JSON.stringify(nodes.get(), null, 4);
    });*/
    nodes.add([
        
    ]);

    // create an array with edges
    edges = new vis.DataSet();
    /*edges.on('*', function () {
        document.getElementById('edges').innerHTML = JSON.stringify(edges.get(), null, 4);
    });*/
    edges.add([
        
    ]);

    // create a network
    var container = document.getElementById('network');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        physics:{
            enabled: true
        }
    };
    network = new vis.Network(container, data, options);

    my_draw(network);
    
}

function my_draw(network){ //buttons triggered
    
   
    $( "input" ).focus(function() { //button on focus
        //console.log('in ' + $(this).data('action'));
        switch ($(this).data('action')) {
            case 'add_node':
                //console.log('  on');
                network.on("click", draw_node);
                break;
            case 'add_edge':
                //console.log('  on');
                draw_edge.ids = [];
                network.on("click", draw_edge);
                break;
            case 'clear_all':
                edges.clear();
                nodes.clear();
                node_counter = 0;
                edge_counter = 0;
                break;
            case 'complete_task':
                complete_task();
                break;
            default:
                break;
        }
        
    });
    $( "input" ).blur(function() { //button on unfocus
        //console.log('out ' + $(this).data('action'));
        switch ($(this).data('action')) {
            case 'add_node':
                //console.log('  off');
                network.off("click", draw_node);
                break;
            case 'add_edge':
                //console.log('  off');
                network.off("click", draw_edge);
                break;
            default:
                break;
        }
        
    });
    
    
};

//////////////////////////
//add node
function draw_node (params) { //while add node button pressed and user click on the canvas
    
    var data_json = JSON.stringify(params, null, 4);
    data_json = JSON.parse(data_json);
    pnt_x = data_json.pointer.canvas.x;
    pnt_y = data_json.pointer.canvas.y;
    node_counter = node_counter + 1;
    pnt_id = node_counter;
    addNode(pnt_x,pnt_y,pnt_id);
}

function addNode(pnt_x, pnt_y,pnt_id) { //add node(trigger by click)
    try {
        nodes.add({
            id: pnt_id,
            label: pnt_id.toString(),
            x: pnt_x,
            y: pnt_y
        });
    }
    catch (err) {
        alert(err);
    }
}


//////////////////////////
//add edge
function draw_edge (params) { //while add edge button pressed and user click on the node
    var data_json = JSON.stringify(params, null, 4);
    data_json = JSON.parse(data_json);
    console.log(data_json);
    if (data_json.nodes.length == 0) {
        draw_edge.ids = [];
        //console.log(draw_edge.ids);
    }
    else {
        draw_edge.ids.push(data_json.nodes[0]);
        if(draw_edge.ids.length == 2) {
            edge_counter = edge_counter + 1;
            addEdge(draw_edge.ids[0], draw_edge.ids[1], edge_counter);
            draw_edge.ids = [];
        }
        //console.log(draw_edge.ids);
    }
    
}

function addEdge(pnt_from_id, pnt_to_id, edge_id) { //add edge(trigger by click)
    try {
        edges.add({
            id: edge_id,
            from: pnt_from_id,
            to: pnt_to_id,
            arrows: 'to'
        });
    }
    catch (err) {
        alert(err);
    }
}


/////////////////////////
//complete task
function complete_task () { //get adjacency matrix and remove the roads by the algorithm
    node_counter = nodes.get().length;
    
    var myMatrix = matrixArray(node_counter,node_counter); //create adjacency matrix (n+1)x(n+1) with 0 values
   
    all_edges = edges.get();
    all_edges_ids = matrixArray(node_counter-1,node_counter-1); //create adjacency matrix nxn with edges id
    for(let i = 0; i < all_edges.length; ++i) {
        myMatrix[all_edges[i].from-1][all_edges[i].to-1] = 1;
        all_edges_ids[all_edges[i].from-1][all_edges[i].to-1] = all_edges[i].id;

        // myMatrix[all_edges[i].to-1][all_edges[i].from-1] = 1;
        // all_edges_ids[all_edges[i].to-1][all_edges[i].from-1] = all_edges[i].id;

        myMatrix[all_edges[i].from-1][node_counter] += 1; // Fi
        myMatrix[node_counter][all_edges[i].to-1] += 1;   // Gi
    }
    
    for (let i = 0; i < node_counter; i++) {
        for (let j = 0; j < node_counter; j++) {
            if(myMatrix[node_counter][j]>1 &&  myMatrix[i][node_counter]>1 && myMatrix[i][j]>0)
            {
                myMatrix[i][j] = "1";
                myMatrix[node_counter][j]--;
                myMatrix[i][node_counter]--;
            }
        }
    }
    flaq = true;
    while(flaq) {
        flaq = false;
        for (let i = 0; i < node_counter; i++) {
            if(myMatrix[i][node_counter]>1)
            for (let j = 0; j < node_counter; j++) {
               if(myMatrix[i][j]===1) {
                   for (let k = 0; k < node_counter; k++) {
                       if(myMatrix[k][j]==='1')
                        for (let z = 0; z < node_counter; z++) {

                            if(myMatrix[k][z]===1 && myMatrix[node_counter][z]>1) {
                                myMatrix[k][z]='1';
                                myMatrix[node_counter][z]--;
                                myMatrix[k][j] = 1;
                                myMatrix[i][j]='1';
                                myMatrix[i][node_counter]--;
                                flaq = true;
                            }
                            
                        }
                   }
               }
            }
        }
    }
    for (let i = 0; i < node_counter; i++) {
        for (let j = 0; j < node_counter; j++) {
           if(myMatrix[i][j]==='1'){
                removeEdge(parseInt(all_edges_ids[i][j]));
           }
        }
    }
    node_counter = nodes.get().length;
    console.log(myMatrix);
    console.log(all_edges_ids);
}

function removeEdge(edge_id) {
    try {
        edges.remove({id: edge_id});
    }
    catch (err) {
        alert(err);
    }
}
