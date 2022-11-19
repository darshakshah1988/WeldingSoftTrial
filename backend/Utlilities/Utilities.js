exports.TYPE_OF_INPUT_CLEANER = {
    QUOTE_REMOVER:"QUOTE_REMOVER",
}
exports.inputFormatter = (value,type=this.TYPE_OF_INPUT_CLEANER.QUOTE_REMOVER) => {
 switch (type) {
    case this.TYPE_OF_INPUT_CLEANER.QUOTE_REMOVER:
        return String(value).match('/\w*\d*/') ? value.split("'")[1] : value
        break;
 
    default:
        break;
 }
}