export const createStartAndEndNodes = (editor, node, isFirst = true) => {
    setTimeout(() => {
        editor.addNode( 
        "start", 1, 1, node.pos_x+350, node.name === "if-else" ? isFirst ? node.pos_y-150 : node.pos_y+150  : node.pos_y+50, 
        `start-nodecontainer`, 
        {id_output: node.id, output_class: isFirst ? "output_1" : "output_2", input_class: "input_1", time: Date.now()}, 
        `<div>
          <div class="title-box bg-dark">Start</div>
          <div class="box">
            <p>This is the <strong>start of the ${node.name} block</strong>${node.name === "if-else" ? isFirst ? "when condition equals true." : "when condition equals false." : ""}</p>
          </div>
          </div>
          `
          ); 
          setTimeout(() => {
            editor.addNode( "end", 1, 0, node.pos_x+1200, node.name === "if-else" ? isFirst ? node.pos_y-150 : node.pos_y+150  : node.pos_y+50, `end-nodecontainer`, {output_class: "output_1", input_class: "input_1"}, 
            `<div>
              <div class="title-box bg-dark">End</div>
              <div class="box">
                <p>This is the <strong>end of the ${node.name} block</strong>${node.name === "if-else" ? isFirst ? "when condition equals true." : "when condition equals false." : ""}</p>
              </div>
              </div>
              `
              ); 
          }, 100);
      }, 100);
}

export const deleteAllConnectedNodes = async(editor, node) => { 
  console.log("if-else connections: ", Object.values(node.outputs));
  await Object.values(node?.outputs).forEach(async({connections}) => {
    let startNode = editor.getNodeFromId( connections[0]?.node)
    console.log("start connections: ", Object.values(startNode?.outputs));
    await Object.values(startNode?.outputs).forEach(({connections}) => {
      connections?.length > 0 && editor.removeNodeId("node-"+connections[0]?.node)
    })
    editor.removeNodeId("node-"+startNode?.id)
  })
}