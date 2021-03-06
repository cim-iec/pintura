import templates from "../../templates/index.js"
import EquipmentContainer from "./EquipmentContainer.js"
import common from "../../src/common.js"

class Bay extends EquipmentContainer {

    static attributeHTML(object, cimmenu, classType="Bay") {
        let attributeEntries = EquipmentContainer.attributeHTML(object, cimmenu, classType);
        if ('cim:Bay.VoltageLevel' in object) {
            attributeEntries['filledEntries']['cim:Bay.VoltageLevel'] =
                cimmenu.getAggregateComponentMenu(
                                                   'cim:'+classType,
                                                   object['pintura:rdfid'],
                                                   object['Bay.VoltageLevel'],
                                                   'cim:VoltageLevel',
                                                   'cim:Bay.VoltageLevel'
                                                 );
        }
        else {
            attributeEntries['emptyEntries']['cim:Bay.VoltageLevel'] =
                cimmenu.getAggregateComponentMenu(
                                                   'cim:'+classType,
                                                   object['pintura:rdfid'],
                                                   object['Bay.VoltageLevel'],
                                                   'cim:VoltageLevel',
                                                   'cim:Bay.VoltageLevel'
                                                 );
        }
        return attributeEntries;
    }

    static isMemberAttribute(attribute) {
        let attributes = [
            "cim:Bay.VoltageLevel",
        ];
        if ( attribute.substr(0,8) == "pintura:") {
            return true;
        }
        if ( attributes.indexOf(attribute) >= 0 ) {
            return true;
        }
        else if ( EquipmentContainer.isMemberAttribute(attribute) ) {
            return true;
        }
        else {
            return false;
        }
    }

    static read(object) {
        Object.keys(object).forEach((attribute) => {
            if (!Bay.isMemberAttribute(attribute)) {
                console.error("Unexpected attribute for class Bay: ", attribute, " with value: ", object[attribute])
            }
        });
    }
    static renderAsClass(object, cimmenu) {
        let separateEntries = Bay.attributeHTML(object, cimmenu);
        let filledEntries = separateEntries['filledEntries'];
        let emptyEntries = separateEntries['emptyEntries'];
        let attributeEntries = { ...filledEntries, ...emptyEntries };
        return templates.handlebars_cim_class_render({ 'attributes': attributeEntries});
    }
    static renderAsAttribute(matchingComponents) {
        let template = templates.handlebars_cim_update_complex_type;
        return template(matchingComponents);
    }
    static subClassList() {
        let subClasses = [
        ];
        return subClasses;
    }
};
export default Bay
