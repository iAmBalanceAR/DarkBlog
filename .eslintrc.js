module.exports = {
    "extends": ["eslint:recommended", "next"],
   
  rules: { 
    "@typescript-eslint/no-empty-object-type": "off",
    "no-unused-vars": ["off", { 
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_"
    }],
    "no-undef": "off",
    "@next/next/no-img-element": "off",
    "react/react-in-jsx-scope": "off"
  }, 
  "parserOptions": {       
     
        "sourceType": "module",
        "ecmaVersion": "latest",
        
  },        
   
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  }
};