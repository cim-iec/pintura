const libxslt = require('libxslt');
const libxmljs = libxslt.libxmljs;
const fs = require('fs');

component_list_xslt = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="1.0">

    <xsl:output method="html" omit-xml-declaration="yes" />
    <xsl:strip-space elements="*"/>
    <xsl:template match="/">
        <root>
        <xsl:for-each select="xs:schema/xs:complexType">
        <xsl:sort select="@name"/>
            <element><xsl:value-of select="@name"/></element><xsl:text>&#xa;</xsl:text>
        </xsl:for-each>
        </root>
    </xsl:template>
</xsl:stylesheet>
`

var loadXMLDoc = function(filename) {
  log("loadXMLDoc.loading " + filename)
  let doc = fs.readFileSync(filename)
  let xml = libxmljs.parseXml(doc);
  return xml;
}

var logOutput = false;

var log = function(str) {
  if (logOutput) {
    process.stderr.write(str + "\n")
  }
};

var performXSLTTranslation = function(xml, xsl, attribute) {

  log("Importing stylesheet..")
  var stylesheetObj = libxmljs.parseXml(xsl, { nocdata: true });
  var stylesheet = libxslt.parse(stylesheetObj);
 
  var params = {}
  if (attribute) {
      log("Setting attribute");
      params['attribute'] = attribute;
  }

  log("Attempting transform..")
  result = stylesheet.apply(xml, params)
  return result
};

var performXSLTTranslationFilenames = function(xmlFile, attributeXSLTFile, menuXSLTFile, debug) {

  log("performXSLTTranslationFilenames.xmlFile ", xmlFile)
  log("performXSLTTranslationFilenames.menuXSLTFile ", menuXSLTFile)
  let returnVariable = { 'menuEntries': '', 'attributeList': ''}
  if (debug) {
    logOutput = true;
  }

  let xml = loadXMLDoc(xmlFile)
  let attributeXSLT = loadXMLDoc(attributeXSLTFile);
  let menuXSLT = loadXMLDoc(menuXSLTFile);
  let components = listComponentsAndPerformXSLTranslation(xmlFile)

  if (components.root()) {

    returnVariable['menuEntries'] = performXSLTTranslation(xml, menuXSLT, null, debug);
    returnVariable['attributeList'] = {};

    let thisResult = "";
    for (let index in components.childNodes()) {
      if (components.childNodes()[index].type() == 'element') {
        let thisComponent = components.childNodes()[index].text()
        log("Creating attribute list for [" + thisComponent + "]");
        thisResult = performXSLTTranslation(xml, attributeXSLT, thisComponent, debug);
        returnVariable['attributeList'][thisComponent] = thisResult + "\n";
      }
    }
  }
  return returnVariable;
};

listComponentsAndPerformXSLTranslation = function(xmlFile) {
  let xml = loadXMLDoc(xmlFile);
  let xsl = libxmljs.parseXml(component_list_xslt);
  return performXSLTTranslation(xml, xsl);
};

module.exports = {
  loadXMLDoc,
  performXSLTTranslation,
  performXSLTTranslationFilenames,
};