export const generateCodeByNodeName = (node, nodeList, nodesParsedToCode, changeNodesParsedToCode = null, isAssign = false) => {
    let code = "";
    switch (node.name) {
        case "variable":
            code = getVariableCode(node, nodesParsedToCode, isAssign)
            break;

        case "math-operation":
            code = getMathOperationCode(node, nodesParsedToCode, nodeList)
            break;

        case "assign":
            code = getAssignCode(node, nodesParsedToCode, nodeList)
            break;

        case "code-block":
            code = getCodeBlockCode(node, nodesParsedToCode)
            break;

        case "if-else":
            code = getIfElseCode(node, nodeList, nodesParsedToCode, changeNodesParsedToCode)
            break;

        case "for-loop":
            code = getForLoopCode(node, nodeList, nodesParsedToCode, changeNodesParsedToCode)
            break;
    
        default:
            break;
    }

    return code
}

const getVariableCode = ({data, id}, nodesParsedToCode, isAssign) => {
    if (nodesParsedToCode.includes(id)) return "";
    return isAssign 
    ? `${data.name}`
    : `${data.name} = ${data.value}\n`
}

const getMathOperationCode = (node, nodesParsedToCode, nodeList) => {
    // if (nodesParsedToCode.includes(node.id)) return "";
    const operators = {
        "add": "+",
        "substract": "-",
        "multiply": "*",
        "divide": "/",
    }
    console.log(node, nodeList);
    let inputNodes = getInputNodes(node, nodeList);
    console.log(inputNodes);
    return inputNodes.join(operators[node.data.operation])

}

const getAssignCode = (node, nodesParsedToCode, nodeList) => {
    console.log(node);
    if (nodesParsedToCode.includes(node.id)) return "";
    const inputNodeCode = generateCodeByNodeName(nodeList.find(v => v.id == node.inputs["input_1"]?.connections[0]?.node), nodeList, nodesParsedToCode, null, true); 
    return `${node.data.name} = ${inputNodeCode}\n`;
}

const getCodeBlockCode = (node, nodesParsedToCode) => {
    if (nodesParsedToCode.includes(node.id)) return "";
    return node.data.customcode + "\n"
}

const getBlockNodes = (connectionsArray, nodeList) => {
    let startNode = nodeList.find(v => v.id == connectionsArray[0].node);
    let endNode = nodeList.find(v => v.id == startNode.outputs.output_1.connections[0].node);
    let nodesFromRectangle = nodeList
    .filter(v => 
    (v.pos_x >= startNode.pos_x && v.pos_x <= endNode.pos_x) && 
    ((v.pos_y >= startNode.pos_y-200 && v.pos_y <= startNode.pos_y+200) || 
    (v.pos_y >= endNode.pos_y-200 && v.pos_y <= endNode.pos_y+200)))
    return nodesFromRectangle.filter(v => v.name !== "math-operation" &&v.name !== "start"&&v.name !== "end")

}

const getInputNodes = (node, nodeList) => {
    let inputNodes = Object.values(node?.inputs).map(({connections}) => {
        console.log(connections);
        let nodeConnected = nodeList?.find(v => v.id == connections[0]?.node);
        return nodeConnected?.data.name
    } );

    return inputNodes
}

const getIfElseCode = (node, nodeList, nodesParsedToCode, changeNodesParsedToCode) => {
    if (nodesParsedToCode.includes(node.id)) return "";
    const operators = {
        "equals": "==",
        "different": "!=",
        "minor": "<",
        "minor-equal": "<=",
        "major": ">",
        "major-equal": ">=",
    }
    let inputNodes = getInputNodes(node, nodeList);
    let code = `if ${inputNodes.join(operators[node.data.operator])} :\n`
    let blockNodesFirstOutput = getBlockNodes(node.outputs.output_1.connections, nodeList)
    console.log(blockNodesFirstOutput);
    let idsParsed = []
    blockNodesFirstOutput.forEach(node => {
        const inputNodeCode = generateCodeByNodeName(node, nodeList, nodesParsedToCode, changeNodesParsedToCode, false); 
        code += "\t" + inputNodeCode
        idsParsed.push(node.id)
    })
    idsParsed.forEach(changeNodesParsedToCode)
    let blockNodesSecondOutput = getBlockNodes(node.outputs.output_2.connections, nodeList)
    console.log(blockNodesSecondOutput);
    if (blockNodesSecondOutput?.length>0 ) {
        code += "\nelse : \n"
        blockNodesSecondOutput.forEach(node => {
            const inputNodeCode = generateCodeByNodeName(node, nodeList, nodesParsedToCode, changeNodesParsedToCode, false); 
            code += "\t" + inputNodeCode
            idsParsed.push(node.id)
        })
        idsParsed.forEach(changeNodesParsedToCode)
    }

    return code + "\n"
}

const getForLoopCode = (node, nodeList, nodesParsedToCode, changeNodesParsedToCode) => {
    if (nodesParsedToCode.includes(node.id)) return "";
    let inputNodes = getInputNodes(node, nodeList);
    let code = `for i in range (${inputNodes?.length > 0 && inputNodes[0] !== undefined ? inputNodes[0] : node.data.times}):\n\t`
    let blockNodesFirstOutput = getBlockNodes(node.outputs.output_1.connections, nodeList)
    console.log(blockNodesFirstOutput);
    let idsParsed = []
    blockNodesFirstOutput.forEach((node, i) => {
        const inputNodeCode = generateCodeByNodeName(node, nodeList, nodesParsedToCode, changeNodesParsedToCode, false); 
        code += `${i>0?"\t\t":"\t"}` + inputNodeCode
        // changeNodesParsedToCode(node.id)
        idsParsed.push(node.id)
    })
    idsParsed.forEach(changeNodesParsedToCode)
    return code + "\n"
}

export const validateTabsFromCode = (code) => {
    let newCode = code
    let lines = newCode?.split("\n")
    lines.forEach((line, i) => {
        if (i>0) {
            let previousLine = lines[i-1];
            let tabsCountPreviousLine = previousLine.split("\t").length-1 
            let tabsCountCurrentLine = line.split("\t").length-1 
            let tabsDifference = parseInt(tabsCountCurrentLine - tabsCountPreviousLine);
            console.log("tabsCountPreviousLine: ", previousLine, tabsCountPreviousLine);
            console.log("tabsCountCurrentLine: ", line, tabsCountCurrentLine);
            console.log("tabsDifference: ", tabsDifference);
            if(tabsDifference >= 2){ 
                lines[i] = line.replace("\t", "");
                console.log("we entered TABS DIFFERENCE IF: ", line, lines[i]);
            }
            if (line.split("").every(v => v==="\t") || line.split("").every(v => v==="\n") || line.split("").every(v => v==="")) {
                console.log("line only has empty spaces: ", line);
                lines.splice(i, 1);
            }
        }
    })
    console.log("we validate code the code: ", lines.join("\n"));
    return lines.join("\n")
}