module.exports = (temp, product) => {
  let output = temp.replace(
    /{%PRODUCTNAME%}|{%ID%}|{%IMAGE%}|{%FROM%}|{%NUTRIENTS%}|{%QUANTITY%}|{%PRODUCTPRICE%}|{%DESCRIPTION%}|{%NOT_ORGANIC%}/g,
    function (match) {
      switch (match) {
        case '{%PRODUCTNAME%}':
          return product.productName;
        case '{%ID%}':
          return product.id;
        case '{%IMAGE%}':
          return product.image;
        case '{%FROM%}':
          return product.from;
        case '{%NUTRIENTS%}':
          return product.nutrients;
        case '{%QUANTITY%}':
          return product.quantity;
        case '{%PRODUCTPRICE%}':
          return product.price;
        case '{%DESCRIPTION%}':
          return product.description;
        case '{%NOT_ORGANIC%}':
          if (!product.organic) return 'not-organic';
      }
    }
  );
  return output;
};
