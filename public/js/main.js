
  $(document).ready(function(){
    // $('#myTabs a').click(function (e) {
    //   e.preventDefault()
    //   $(this).tab('show')
    // })
    var pathname = window.location.pathname;
    console.log("pathname is...", pathname);
    if (pathname === "/voiddeck/requests/view") {
      $('.user-menu').find('.active').removeClass('active');
      $('.user-menu li:nth-child(1)').addClass('active');
    }
    else if (pathname === "/voiddeck/requests/create") {
      $('.user-menu').find('.active').removeClass('active');
      $('.user-menu li:nth-child(2)').addClass('active');
    }
    // $('.user-menu li').on('click', function() {
    //   var activeIndex = $(this).index();
    //   sessionStorage.setItem('mySelectValue', activeIndex);
    // })
    // // $(".user-menu li:nth-child(2)").addClass('active');
    // var activeIndex = parseInt(sessionStorage.getItem('mySelectValue')) + 1;
    // if (activeIndex) {
    //     // $('.pull-right li:nth-child('+activeIndex+')').addClass('active');
    //     $('.user-menu').find('.active').removeClass('active');
    //     $('.user-menu li:nth-child('+activeIndex+')').addClass('active');
    // }
    // else {
    //   $('.user-menu li:nth-child(1)').addClass('active');
    // }
    // } else {
    //     $('.pull-right:nth-child('+activeIndex+')').addClass('active');
    // }





    // function intervals(startString) {
        var startString = Date();
        var start = moment(startString, 'ddd MMM DD YYYY HH:mm:ss');
        var end = moment(start).add(1,'days');

        // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
        // note that 59 will round up to 60, and moment.js handles that correctly
        start.minutes(Math.ceil(start.minutes() / 15) * 15);

        // var result = [];
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

            // result.push(current.format('ddd DD/MM/YYYY h:mm A'));
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
