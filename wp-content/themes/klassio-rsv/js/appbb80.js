var menuStatus;
var App = new Object();

App = {
    splashScreenDuration: 1000,
    init: function() {
        
        //this should run only once
        $("#menu li a").click(function(){
            $("#menu").hide();
            $(".ui-page-active").animate({marginLeft: 0});
	    $("body").scrollTop(0);
            menuStatus = false;
            var p = $(this).parent();
            if($(p).hasClass('current_page_item')){
                $(".current_page_item").removeClass('current_page_item');
		$(p).addClass('current_page_item');
            } else {
                $(".current_page_item").removeClass('current_page_item');
                $(p).addClass('current_page_item');
            }
        });
        
        setTimeout(function() {
		$("#splash").fadeOut(800);
	}, App.splashScreenDuration);
        
        App.pageInit();
	$(document).bind("pagebeforechange", function() {
		//remove anim-done from previous page's slider
		$(".cherry-slider.anim-done").removeClass("anim-done");
	});
        $(document).bind("pageinit", App.pageInit);
	$(document).bind("pageshow", function() {
		$("body").scrollTop(0);
		$("body").scrollTop(0);
		setTimeout(App.windowLoaded, 1000);
	});
    },
    pageInit: function() {
	App.navInit();
	$('ul:not([class])').addClass("bullet-1");
	setTimeout(function() {
		$('.flexslider:not(.flexslidered)').addClass("flexslidered").flexslider({
			animation: "slide",
			controlNav: false
		});
	}, 1000)
      
      
      //custom checkboxes
      $('.on-off:not(.iphoneStyled)').addClass("iphoneStyled").iphoneStyle();
      
      //initialize photoswipe for portfolio page
      if ($(".photoswipe a:not(.photoSwiped)").length) //dont run if already ran before
         $(".photoswipe a:not(.photoSwiped)").addClass("photoSwiped").click(function(e) {
	}).photoSwipe({});
	
	
        $("#menu").hide();
        $(".ui-page-active").css({
            marginLeft: 0
        });
            
	$(".scroll-to-top").click(function() {
		$("body").animate({scrollTop: 0}, 1000);
	});
	
        $("body").scrollTop(0);
        $("body").scrollTop(0);
        setTimeout(App.windowLoaded, 1000);
	
	//maps
	App.refreshMaps();
	App.Forms.bind();
	App.afterPageInit();
    },
    afterPageInit: function() {
      //tap event effects for links
      $("a:not(.tapInEffected)").addClass("tapInEffected").bind("touchstart mousedown", function() {
         $(this).addClass("hover");
      });
      $("a:not(.tapOutEffected)").addClass("tapOutEffected").bind("touchmove touchend mouseup", function() {
         $(this).removeClass("hover");
      });
      
      //hack for fixing WP editor bug that adds <p></p> before the layer slider
      if ($(".cherry-slider").length) {
	if ($(".cherry-slider").prev().html() == "")
	    $(".cherry-slider").prev().remove();
      }
      
   },

    navInit: function() {
        
        //$.event.special.swipe.horizontalDistanceThreshold = 100;
        if ($(".current_page_item").length == 0)
	    $("#menu li:first a").click();
	    
	$(".ui-slider, .slider-component, .prevent-swipe-menu").bind("swiperight", function(e) {
		e.stopPropagation();
	});
	
        $('.pages').bind("swipeleft", function(){
                $(".ui-page-active").css({
                    marginLeft: "0px",
                }, 300,
                function(){
                    menuStatus = false;
                    $("#menu").hide();
                });
        });
        $('.pages').bind("swiperight", function(){
                $("#menu").show();
                $(".ui-page-active").css({
                    marginLeft: "165px",
                }, 300, function(){
                    menuStatus = true
                });
		$("body").animate({scrollLeft: 0, scrollTop: 0});
        });
        $("a.back-button").click(function(e) {
            e.preventDefault();
            history.back();
        });
        $("a.showMenu:not(.clickBound)").addClass("clickBound").click(function(){
            if(menuStatus != true){
                $("#menu").show();
                $(".ui-page-active").css({
                    marginLeft: "165px",
                });
		menuStatus = true;
                return false;
            } else {
                $(".ui-page-active").css({
                    marginLeft: "0px",
                });
		menuStatus = false;
                return false;
            }
        });
        
        
        
    },
    windowLoaded: function() {
        //cherry slider
        if ($(".cherry-slider:not(.anim-done)").length) {
            $.each($(".cherry-slider"), function(i, elem) {
                App.cherrySliderInit(elem)
            });
        }
    },
    refreshMaps: function(){
	if (!$(".map").length)
	   return;
	$('.map').each(function(){
	     var me = $(this);
	     var locationTitle = $(this).attr('data-location');
	     var myId = $(me).attr('id');
	     var geocoder = new google.maps.Geocoder();
	     geocoder.geocode({
		  address: locationTitle
	      }, function(locResult) {
		  var latVal = locResult[0].geometry.location.lat();
		  var longVal = locResult[0].geometry.location.lng();
		  App.initializeMap(myId, locationTitle, latVal, longVal);
	      });
	});
     },
     initializeMap: function(locationVal, titleVal, latVal, longVal) {
	var latlng = new google.maps.LatLng(latVal, longVal);
	var settings = {
		zoom: 13,
		center: latlng,
		mapTypeControl: false,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		navigationControl: false,
		navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
		streetViewControl: false,
		zoomControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP 
	};
	var map = new google.maps.Map(document.getElementById(locationVal), settings);
	
	
	var nibrasPos= new google.maps.LatLng(latVal, longVal);
	var nibrasMarker = new google.maps.Marker({
		  position: nibrasPos,
		  map: map,
		  title:titleVal
	});
     },
    cherrySliderInit: function(elem) {
        var sliderHelper = {
            myParseInt: function(val) {
                if (val == undefined)
                    return undefined;
                if (val.indexOf("%") >= 0)
                    return val;
                else
                    return parseInt(val)
            },
            animate: function(item) {
		if (!$(elem).is(":visible")) {
			return;
		}
                //decide anim
                var anim = item.attr("anim");
                var direction = item.attr("anim-direction");
                var left = sliderHelper.myParseInt(item.attr("anim-position-left"));
                var right = sliderHelper.myParseInt(item.attr("anim-position-right"));
                var top = sliderHelper.myParseInt(item.attr("anim-position-top"));
                var animSpeed = sliderHelper.myParseInt(item.attr("anim-speed"));
		var times = sliderHelper.myParseInt(item.attr("anim-times"));
                var action = item.attr("anim-action");
                if (action == "restart") {
                    setTimeout(function() {
                        sliderHelper.animate(item.parent().find(".anim-item:first"));
                    }, animSpeed);
                } else if (action == "break") {
                    if (anim == "fade") {
                        item.prevAll(".anim-item").fadeOut(animSpeed);
                    } else {
                        item.prevAll(".anim-item").effect(anim, {mode: "hide", direction: direction}, animSpeed);
                    }
                    setTimeout(function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    }, animSpeed);

                } else if (anim == "slide") {
                    if (direction == "right" && left)
                        item.css({left: $(item).parents(".cherry-slider").width()});
                    if (direction == "left" && right)
                        item.css({right: $(item).parents(".cherry-slider").width()});
                    if (direction == "down")
                        item.css({top: $(item).parents(".cherry-slider").height()});
                    item.css({opacity: 0}).show();
                    item.animate({opacity: 1, right: right, left: left, top: top}, parseInt(animSpeed), function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    });
                } else if (anim == "fade") {
                    
                    item.css({opacity: 0, right: right, left: left, top: top});
                    item.show();
                    item.animate({opacity: 1}, parseInt(animSpeed), function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    });
                } else if (anim == "drop") {
                    if (right != undefined)
                        left = $(item).parents(".cherry-slider").width() - right - item.width();
                    item.css({opacity: 1, left: left, top: top});
                    //item.hide();
                    item.effect("drop", {mode: "show", distance: 8, direction: direction}, animSpeed, function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    });
                } else if (anim == "bounce") {
                    if (right != undefined)
                        left = $(item).parents(".cherry-slider").width() - right - item.width();
                    item.css({opacity: 1, left: left, top: top});
                    item.hide();
                    item.effect("bounce", {times: (times == undefined ? 1 : times), distance: 10, mode: "show", direction: direction}, animSpeed, function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    });
                    
                } else if (anim == "puff") {
                    if (right != undefined)
                        left = $(item).parents(".cherry-slider").width() - right - item.width();
                    item.css({opacity: 1, left: left, top: top});
                    item.hide();
                    item.effect("puff", {mode: "show", direction: direction}, animSpeed, function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    });
                } else if (anim == "blind") {
                    if (right != undefined)
                        left = $(item).parents(".cherry-slider").width() - right - item.width();
                    item.css({opacity: 1, left: left, top: top});
                    item.hide();
                    item.effect("blind", {mode: "show", direction: direction}, animSpeed, function() {
                        if (item.next().hasClass("anim-item"))
                            sliderHelper.animate(item.next())
                    });
                }
            }
        }
	if ($(elem).hasClass("anim-done")) {
            //restart anim
	    $(".anim-item").effect("fade", {mode: "hide"}, 100, function() {
		sliderHelper.animate($(".anim-item:first", $(elem)));
	    });
	    return;
        }
        else
            $(elem).addClass("anim-done");
        
        $(".anim-item", elem).css({opacity: 0}).show();
        var currentItem = $(".anim-item:first", elem);
        sliderHelper.animate(currentItem);
    },
    Util: {
	mobile: {
         detect:function(){
            var uagent = navigator.userAgent.toLowerCase(); 
            var list = this.mobiles;
            var ismobile = false;
            for(var d=0;d<list.length;d+=1){
                    if(uagent.indexOf(list[d])!=-1){
                            ismobile = list[d];
                    }
            }
            return ismobile;
         },
         mobiles:[
            "midp","240x320","blackberry","netfront","nokia","panasonic",
            "portalmmm","sharp","sie-","sonyericsson","symbian",
            "windows ce","benq","mda","mot-","opera mini",
            "philips","pocket pc","sagem","samsung","sda",
            "sgh-","vodafone","xda","palm","iphone",
            "ipod","android"
         ]
       }
    },
    Forms: {
      bind: function() {
         // Add required class to inputs
         $(':input[required]').addClass('required');
         
         // Block submit if there are invalid classes found
         $('form:not(.html5enhanced)').addClass("html5enhanced").submit(function() {
               var formEl = this;
                 $('input,textarea').each(function() {
                         App.Forms.validate(this);
                 });
                 
                 if(($(this).find(".invalid").length) == 0){
                         // Delete all placeholder text
                         $('input,textarea').each(function() {
                                 if($(this).val() == $(this).attr('placeholder')) $(this).val('');
                         });
                         
			 
			 if ($(formEl).hasClass("ajax-form")) {
			    //now submit form via ajax
			    $.ajax({
			      url: $(formEl).attr("action"),
			      type: $(formEl).attr("method"),
			      data: $(formEl).serialize(),
			      success: function(r) {
				 if (r) {
				    $(".success-message").slideDown().removeClass("hidden");
				 }
			      }
			    })
			    return false;
			 } else {
			    return true;
			 }
                 }else{
                         return false;
                 }
         });

      },
      is_email: function(value){
	return (/^([a-z0-9])(([-a-z0-9._])*([a-z0-9]))*\@([a-z0-9])(([a-z0-9-])*([a-z0-9]))+(\.([a-z0-9])([-a-z0-9_-])?([a-z0-9])+)+$/).test(value);
      },
      is_url: function(value){
              return (/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i).test(value);
      },
      is_number: function(value){
              return (typeof(value) === 'number' || typeof(value) === 'string') && value !== '' && !isNaN(value);
      },
      validate: function(element) {
         var $$ = $(element);
         var validator = element.getAttribute('type'); // Using pure javascript because jQuery always returns text in none HTML5 browsers
         var valid = true;
         var apply_class_to = $$;
         
         var required = element.getAttribute('required') == null ? false : true;
         switch(validator){
                 case 'email': valid = App.Forms.is_email($$.val()); break;
                 case 'url': valid = App.Forms.is_url($$.val()); break;
                 case 'number': valid = App.Forms.is_number($$.val()); break;
         }
         
         // Extra required validation
         if(valid && required && $$.val().replace($$.attr('placeholder'), '') == ''){
                 valid = false;
         }
         
         // Set input to valid of invalid
         if(valid || (!required && $$.val() == '')){
                 apply_class_to.removeClass('invalid');
                 apply_class_to.addClass('valid');
                 return true;
         }else{
                 apply_class_to.removeClass('valid');
                 apply_class_to.addClass('invalid');
                 return false;
         }
      }

   }

}

App.activateMenu = function(postId) {
    //$("#menu li").removeClass('current_page_item');
    $(".page-item-" + postId + ", .menu-item-" + postId).addClass('current_page_item').parents("li").addClass('current_page_item');
    menuStatus = false;
}

$(App.init);

function twitterCallback(twitters) {
  var statusHTML = [];
  for (var i=0; i<twitters.length; i++){
    var username = twitters[i].user.screen_name;
    var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      return '<a href="'+url+'">'+url+'</a>';
    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
    });
    //statusHTML.push('<li><span>'+status+'</span> <a style="font-size:85%" href="http://twitter.com/'+username+'/statuses/'+twitters[i].id_str+'">'+relative_time(twitters[i].created_at)+'</a></li>');
    statusHTML.push('<h2 class="font-14">'+status+'</h2><p>'+relative_time(twitters[i].created_at)+'</p>')
  }
  document.getElementById('twitter_update_list').innerHTML = statusHTML.join('');
  $("#twitter_update_list a").addClass("ui-link");
}

function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}