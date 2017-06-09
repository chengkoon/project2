
  $(document).ready(function(){

  /* Bootstrap plugins */
  $('[data-toggle="tooltip"]').tooltip({container: 'body'})
  $('.collapse').collapse();
  $('[data-toggle="popover"]').popover({container: 'body'})
  $('.dropdown-toggle').dropdown();

  /* to add active class for tabs in navbar */
  var pathname = window.location.pathname;
  console.log("pathname is...", pathname);
  if (pathname === "/voiddeck/requests/view") {
    $('.navbar-right').find('.active').removeClass('active');
    $('.navbar-right').find('.active').removeClass('active');
    $('.navbar-right li:nth-child(1)').addClass('active');
    $('.navbar-right li:nth-child(1)').addClass('active');
  }
  else if (pathname === "/voiddeck/requests/create" || pathname === "/voiddeck/requests/user") {
    $('.navbar-right').find('.active').removeClass('active');
    $('.navbar-right').find('.active').removeClass('active');
    $('.navbar-right li:nth-child(2)').addClass('active');
    $('.navbar-right li:nth-child(2)').addClass('active');
  }
  else if (pathname === "/register") {
    $('.navbar-right').find('.active').removeClass('active');
    $('.navbar-right li:nth-child(1)').addClass('active');
  }
  else if (pathname === "/login") {
    $('.navbar-right').find('.active').removeClass('active');
    $('.navbar-right li:nth-child(2)').addClass('active');
  }

  var startString = Date();
  var start = moment(startString, 'ddd MMM DD YYYY HH:mm:ss');
  var end = moment(start).add(1,'days');

  // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
  // note that 59 will round up to 60, and moment.js handles that correctly
  start.minutes(Math.ceil(start.minutes() / 15) * 15);

  var i;
  var j = 1;
  var $select = $(".from");
  var $select2 = $(".to");
  $select.append($('<option>Collection Time From:</option>').html(i));
  $select2.append($('<option>Collection Time To:</option>').html(i));


  var current = moment(start);

  while (current <= end) {
      i = current.format('ddd DD/MM/YYYY h:mm A');
      $select.append($('<option></option>').attr("class", j).html(i));
      $select2.append($('<option id="'+ j +'"></option>').html(i));
      current.add(15, 'minutes');
      j++;
  }

  $('.from').change(function () {

      // var chosenCollectionTimeFrom = parseInt($(this).val()); // 1,2,3,4, or ...
      var chosenCollectionTimeFrom = parseInt($('select[name="collectionFrom"] :selected').attr('class'));
      var newDefault = chosenCollectionTimeFrom + 2;
      var chosenTimeFrom = $('.from option[value="'+chosenCollectionTimeFrom+'"]').text();
      var chosenTimeFromUTC = moment(chosenTimeFrom, 'ddd DD/MM/YYYY h:mm A').valueOf();

      $('.to option').removeAttr("disabled").filter(function(index) {
        return $(this).attr("id") <= chosenCollectionTimeFrom;
      })
      .attr('disabled','disabled')
      $('.to option[id="'+newDefault+'"]').attr("selected",true);
  });

});
