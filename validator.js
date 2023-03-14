class Validator {
    constructor(config) {
      this.elementsConfig = config;
      this.errors = {};
  
      this.generateErrorObject();
      this.inputListener();
    }
  
    generateErrorObject() {
      for (let field in this.elementsConfig) {
        this.errors[field] = [];
      }
    }
  
    inputListener() {
      let inputSelector = this.elementsConfig;
      for (let field in inputSelector) {
        let selector = `input[name=${field}]`;
        let el = document.querySelector(selector);
  
        el.addEventListener("input", this.validate.bind(this));
      }
    }
  
    validate(e) {
      let elFields = this.elementsConfig;
  
      let field = e.target;
      let fieldName = field.getAttribute("name");
      let fieldValue = field.value;
  
      this.errors[fieldName] = [];
  
      if (elFields[fieldName].required) {
        if (fieldValue === "") {
          this.errors[fieldName].push("Polje je prazno");
        }
      }
  
      if (elFields[fieldName].email) {
        if (!this.validateEmail(fieldValue)) {
          this.errors[fieldName].push("Neispravna email adresa!");
        }
      }
  
      if (
        fieldValue.length < elFields[fieldName].minlength ||
        fieldValue.length > elFields[fieldName].maxlength
      ) {
        this.errors[fieldName].push(
          `Polje mora imati minimalno ${elFields[fieldName].minlength}, ili maksimalno ${elFields[fieldName].maxlength} karaktera!`
        );
      }
  
      if (elFields[fieldName].matching) {
        let matchingEl = document.querySelector(
          `input[name="${elFields[fieldName].matching}"]`
        );
        if (fieldValue !== matchingEl.value) {
          this.errors[fieldName].push("Lozinke se ne poklapaju!");
        }
        if (this.errors[fieldName].length === 0) {
          this.errors[fieldName] = "";
          this.errors[elFields[fieldName].matching] = "";
        }
      }
      this.populateErrors(this.errors);
    }
  
    populateErrors(errors) {
      for (const elem of document.querySelectorAll("ul")) {
        elem.remove();
      }
      for (let key of Object.keys(errors)) {
        let parentElement = document.querySelector(
          `input[name="${key}"]`
        ).parentElement;
        let errorsElement = document.createElement("ul");
        parentElement.appendChild(errorsElement);
  
        if (errors[key].length > 0) { // only iterate if there are errors
          errors[key].forEach((error) => {
            let li = document.createElement("li");
            li.innerText = error;
  
            errorsElement.appendChild(li);
          });
        }
      }
    }
  
    validateEmail(email) {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        return true;
      }
      return false;
    }
  }
  