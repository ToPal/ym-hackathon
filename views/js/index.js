// $(document).ready(function() {
//   $('.auth').click(function(e) {
//     doPost('https://sp-money.yandex.ru/oauth/authorize', {
//       client_id: '3C8EB4377C987BA354A59F09A066375AEF4203E02EEDBFFB5B527EF99D1D7606',
//       response_type: 'code',
//       redirect_uri: 'http://portion.cloudapp.net:8080/ym-result',
//       scope: 'operation-history'
//     }, function(msg) {
//       setStatus('success! ' + JSON.stringify(msg));
//     })
//   });
// });

var userParams = {
  age: 25,
  height: 180,
  weight: 80,
  sex: 'male',
  activity: 1.3,
  
  caloric: 1967.2,
  breakfast_one: {"caloricPercentage":0.3,"proteins":1.95,"fats":4.9,"carbohydrates":17.5,"caloric":590.1},
  breakfast_two: {"caloricPercentage":0.15,"proteins":7.35,"fats":16.1,"carbohydrates":9,"caloric":295.05},
  lunch: {"caloricPercentage":0.35,"proteins":5.1,"fats":12.95,"carbohydrates":10.5,"caloric":688.45},
  dinner: {"caloricPercentage":0.2,"proteins":6,"fats":14,"carbohydrates":13,"caloric":393.4}
};
userParams.show = function() {
  $('.user-params [name=age]')[0].value = userParams.age;
  $('.user-params [name=height]')[0].value = userParams.height;
  $('.user-params [name=weight]')[0].value = userParams.weight;
  $('.user-params [name=sex][value=male]')[0].checked = (userParams.sex === 'male');
  $('.user-params [name=sex][value=female]')[0].checked = (userParams.sex === 'female');
  $('.user-params [name=activity]')[0].value = userParams.activity;
}
userParams.update = function() {
  userParams.age = $('.user-params [name=age]')[0].value;
  userParams.height = $('.user-params [name=height]')[0].value;
  userParams.weight = $('.user-params [name=weight]')[0].value;
  if ($('.user-params [name=sex][value=female]')[0].checked) {
  	userParams.sex = 'female';
  } else {
  	userParams.sex = 'male';
  }
  userParams.activity = $('.user-params [name=activity]')[0].value;
}
userParams.updateCaloric = function(callback) {
  doPost('http://portion.su:8080/api/', {
    command: 'getOptimalCaloric',
    age: userParams.age,
    height: userParams.height,
    weight: userParams.weight,
    sex: userParams.sex,
    activity: userParams.activity
  }, function(res) {
    userParams.caloric = res.commandResult;
    
    if (callback !== undefined) {
      callback();
    }
  });
}
userParams.getMealsParams = function() {
  doPost('http://portion.su:8080/api/', {
    command: 'getMealsParameters',
    caloric: userParams.caloric
  }, function(res) {
    userParams.breakfast_one = res.meals[0];
    userParams.breakfast_two = res.meals[1];
    userParams.lunch = res.meals[2];
    userParams.dinner = res.meals[3];
  });
}

var products = function(name, products) {
  this.name = name;
  this.products = products || [];
}
products.prototype.containter = function() {
  return $('.portion.' + this.name);
}
products.prototype.template = function() {
  return $('.product.template');
}
products.prototype.clear = function() {
  this.products = [];
  this.containter().find('.product').remove();
}
products.prototype.show = function() {
  var that = this;
  var removeFunction = function(i) {
    return function() {
      that.products.splice(i, 1);
      that.show();
      that.updateProductsWeight();
    }
  }

  this.containter().find('.product').remove();
  
  for (var i in this.products) {
    var product = this.template().clone();
    product.removeClass('template');
    
    $(product).find('.name').html(this.products[i].name);
    $(product).find('.weight').html(Math.floor(this.products[i].weight));
    $(product).find('.caloric').html(this.products[i].caloric);
    $(product).find('.proteins').html(this.products[i].proteins);
    $(product).find('.fats').html(this.products[i].fats);
    $(product).find('.carbohydrates').html(this.products[i].carbohydrates);
    $(product).find('.productId').html(this.products[i].id);
    
    $(product).find('.remove').click(removeFunction(i));
    
    this.containter().append(product);
  }
}
products.prototype.setProducts = function(newProducts) {
  this.products = newProducts;
}
products.prototype.updateProductsWeight = function(callback) {
  var that = this;
  doPost('http://portion.su:8080/api/', {
    command: 'getProductsWeight',
    products: this.products,
    mealParameters: userParams[this.name]
  }, function(res) {
    if ((res.commandResult === undefined) || (res.commandResult.length === undefined) || (res.commandResult.length === 0)) {
      return that.containter().addClass('inappropriate');
    }
    
    for (var i in res.commandResult) {
      that.products[i].weight = res.commandResult[i].weight;
    }
    
    that.containter().removeClass('inappropriate');
    if (callback) { callback(); }
  });
}

var dayRation = {};
dayRation.show = function() {
  dayRation.breakfast_one.show();
  dayRation.breakfast_two.show();
  dayRation.lunch.show();
  dayRation.dinner.show();
}
dayRation.updateProductsWeight = function(callback) {
  if (callback === undefined) {
    dayRation.breakfast_one.updateProductsWeight();
    dayRation.breakfast_two.updateProductsWeight();
    dayRation.lunch.updateProductsWeight();
    dayRation.dinner.updateProductsWeight();
  } else {
    dayRation.breakfast_one.updateProductsWeight(function() {
      dayRation.breakfast_two.updateProductsWeight(function() {
        dayRation.lunch.updateProductsWeight(function() {
          dayRation.dinner.updateProductsWeight(callback);
        });
      });
    });
  }
}

function doPost(address, params, callback) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: address,
        data: params,
        crossDomain: true,
        async: true,
        success: function(msg){
            if (msg.result != "ok") {
                setStatus(msg.errorMessage);
                return;
            }
            callback(msg);
        },
        error: function(jqXHR, textStatus, errorThrown ) {
            setStatus("Возникла ошибка. Обратитесь, пожалуйста, к разработчику.");
        }
    });
}

function setStatus(text) {
  console.log(text);
  $('.status').html(text);
}

$(document).ready(function() {
  userParams.show();
  dayRation.breakfast_one = new products('breakfast_one', [{"name":"Яичница глазунья","caloric":"241","proteins":"15.9","fats":"19.3","carbohydrates":"1","id":"3398","weight":26.97},{"name":"Батончик мюсли Ego с клубникой в йогурте","caloric":418,"proteins":4,"fats":14.5,"carbohydrates":67.5,"id":309,"weight":127.68}]);
  dayRation.breakfast_two = new products('breakfast_two', [{"name":"Банан","caloric":"89","proteins":"1.5","fats":"0.1","carbohydrates":"21.8","id":"3461","weight":32.70300035827208},{"name":"Даниссимо Шоколад","caloric":"148","proteins":"5","fats":"7.1","carbohydrates":"16","id":"670","weight":116.29040859409972},{"name":"Семя подсолнечника","caloric":578,"proteins":20.7,"fats":52.9,"carbohydrates":5,"id":191,"weight":69.31751573032237}]);
  dayRation.lunch = new products('lunch', [{"name":"Борщ из свежей капусты с мясом","caloric":"63","proteins":"4.4","fats":"3.6","carbohydrates":"5.5","id":"363","weight":65.63648101538013},{"name":"Бекон","caloric":"500","proteins":"23","fats":"45","carbohydrates":"0","id":"322","weight":44.936001576823855},{"name":"Шоколад молочный","caloric":547,"proteins":6.9,"fats":35.7,"carbohydrates":52.4,"id":204,"weight":59.47353865825969},{"name":"Пирожное слоеное с яблоком","caloric":454,"proteins":5.7,"fats":25.6,"carbohydrates":52.7,"id":208,"weight":30.664388977387365}]);
  dayRation.dinner = new products('dinner', [{"name":"Салат Витаминный","caloric":"146","proteins":"1.4","fats":"13.4","carbohydrates":"5.8","id":"2100","weight":283.41117011067746},{"name":"Батончик Herbalife Протеиновый","caloric":383,"proteins":29,"fats":8.6,"carbohydrates":46,"id":296,"weight":48.62132940950675}]);
  dayRation.updateProductsWeight(dayRation.show);
});