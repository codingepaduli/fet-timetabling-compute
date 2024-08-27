
function addTemplate(targetId, templateID) {
  if (typeof targetId !== 'string' && ! (targetId instanceof String) ) {
    throw new Error("param 'targetId' is not a string");
  }
  if (typeof templateID !== 'string' && ! (templateID instanceof String) ) {
    throw new Error("param 'templateID' is not a string");
  }
  
  const target = document.querySelector(targetId);
  const template = document.querySelector(templateID);
  
  if (target != null && template != null) {
    target.append(template.content.cloneNode(true));
  }
}

function replaceTemplateData(dataNodeSelector, dataToReplace={}) {
  if (typeof dataNodeSelector !== 'string' && ! (dataNodeSelector instanceof String) ) {
    throw new Error("param 'dataNodeSelector' is not a string");
  }
  if (!dataToReplace instanceof Object || Array.isArray(dataToReplace) || dataToReplace === null) {
    throw new Error("param 'dataToReplace' is not an object (empty object is allowed)");
  }

  const nodeToReplace = document.querySelectorAll(dataNodeSelector + " .replaceData");
  console.debug(`Found ${nodeToReplace.length} elements to replace in node ${dataNodeSelector}`);

  nodeToReplace.forEach(node => {
    Object.entries(dataToReplace).forEach(([key, val]) => {
      console.debug(`Replacing \$\{${key}\} --> ${val}`);
      node.textContent = node.textContent.replace(`\$\{${key}\}` , `${val}`);
    });
  });
}
