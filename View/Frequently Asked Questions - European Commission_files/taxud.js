/**
 * @file
 */

(function ($) {

  Drupal.behaviors.taxud_js_injector = {
    attach: function (context) {
      $(window).resize(function () {
        // Menu behaviour.
        if ($(window).width() > 768) {
          $('.navbar .dropdown > a').on('click', function () {
            location.href = this.href;
          });
        }
        else {
          $('.navbar .dropdown > a').off('click');
        }
      });
      $(window).trigger('resize');

      // The Missing part.
      $('.toggleContent').hide();
      $('.menuToggle').on('click', function () {
        $('.toggleContent').slideUp();
        that = $(this);
        c_index = that.index();
        $('.toggleContent:nth-child(' + c_index + ')').slideToggle();
      });
      $(".slides> li:gt(0)").hide();
      setInterval(function () {
        $('.slides > li:first')
          .fadeOut(1000)
          .next()
          .fadeIn(1000)
          .end()
          .appendTo('.slides');
      }, 5000);
      $('.dropdown-menu .list-group-item.dropdown-toggle') .removeAttr("href");

      $("textarea[maxlength]").bind('input propertychange', function () {
        var maxLength = $(this).attr('maxlength');
        if ($(this).val().length > maxLength) {
           $(this).val($(this).val().substring(0, maxLength));
        }
      });

      // Enable configurable JS redirections.
      if ($("#taxud-enable-js-redirection").length > 0 && $("#taxud-enable-js-redirection").attr("data-location") && $("#taxud-enable-js-redirection").attr("data-timeout")) {
          var timer = setTimeout(function () {
              window.location = $("#taxud-enable-js-redirection").attr("data-location")
          }, $("#taxud-enable-js-redirection").attr("data-timeout"));
      }
      // e-learning.
      var path = 'https://ec.europa.eu/assets/taxud/taxation_customs/elearning/files';
      var div_close = '';
      var div_open = '';

      function fillSubcategories(fileVersions) {
        if (fileVersions == null) {
            return;
        }
        items = fileVersions.split(',');
        if (items[0] != null) {
          $('#field_language').html($('<option>', {
              value: '',
              text : '--- Choose ---'
            }));
          $.each(items, function (i, item) {
              itemdata = item.split('-');
              $('#field_language').append($('<option>', {
                  value: itemdata[0],
                  text : itemdata[0] + ' (' + itemdata[1] + ' MB)'
                }));
          });
        }
      }

      function checkEmail(frmfieldEmail) {
        var formField;
        formField = frmfieldEmail;
        var regexp = /^[a-zA-Z0-9._'-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z0-9.-]{2,4}$/;
        if (!(regexp.test(formField.value))) {
            return false;
        }
        return true;
      };

      function identicalEmail(frmfieldEmail, frmfieldEmail2) {
        var formField;
        var formField2;
        formField = frmfieldEmail;
        formField2 = frmfieldEmail2;
        if (formField.value != formField2.value) {
            return false;
        }
        return true;
      };

      function download_file(file_link) {
        var zipfile = path + '/' + file_link;
        window.open(zipfile, "_blank");
      }

      function verifCourse(obj) {
        form = obj.form;
        if (form.field_course.value == "") {
            alert(Drupal.t('Please select the course.'));
            form.field_course.focus();
        }
        if (form.field_ebook.value == "") {
            alert(Drupal.t('Please select the ebook.'));
            form.field_ebook.focus();
        }
      }

      function validateDownloadForm(formObject) {
        var isChecked = false;
        var theCourse = '';
        var theLanguage = '';
        var theVersion = 'zip';
        var theType = '';
        if (formObject.field_type.value == '') {
            alert(Drupal.t('Please select courses or e-books.'));
            formObject.field_course.focus();
            return false;
        }
        if (formObject.field_course.value == '') {
            alert(Drupal.t('Please select the course.'));
            formObject.field_course.focus();
            return false;
        }
        if ((formObject.field_language.value == '') || (formObject.field_language.value == '0') || (formObject.field_language.value == null)) {
            alert(Drupal.t('Please select the language.'));
            formObject.field_language.focus();
            return false;
        }
        if (!checkEmail(formObject.field_email)) {
            alert(Drupal.t('The e-mail address you entered is not valid!'));
            formObject.field_email.focus();
            formObject.field_email.select();
            return false;
        }
        if (!identicalEmail(formObject.field_email,formObject.field_email_confirm)) {
            alert(Drupal.t('The repeated e-mail address you entered is wrong!'));
            formObject.field_email_confirm.focus();
            formObject.field_email_confirm.select();
            return false;
        }
        if (formObject.security_code.value == '') {
            alert(Drupal.t('Please type the visual confirmation.'));
            formObject.security_code.focus();
            return false;
        }
        if (formObject.field_country.value == '') {
            alert(Drupal.t('Please select your country.'));
            formObject.field_country.focus();
            return false;
        }
        if (formObject.field_disclaimer.checked == false) {
            alert(Drupal.t('Do you agree with the disclaimer, the privacy statement and the copyright ?'));
            return false;
        }

        return true;
      };

      $('#btn_send').click(function (e) {
        e.preventDefault();
        if (validateDownloadForm($('#TaxudDownloadForm')[0])) {
          if ($("#field_type").val() == "courses") {
            theType = $('#field_course option:selected').val().toLowerCase();
          }
else if ($("#field_type").val() == "ebooks") {
            theType = $('#field_ebook option:selected').val().toLowerCase();
          }
          file_link = theType + '_' + $('#field_language option:selected').val().toLowerCase() + '.zip';

          download_file(file_link);
          $('#TaxudDownloadForm').submit();
        }
      })

      $('#field_course, #field_ebook').on('change', function () {
                  if ($("#field_type").val() == "courses") {
                    fillSubcategories($('#field_course').find('option:selected').attr('data-file-versions'));
                  }
        else if ($("#field_type").val() == "ebooks") {
                    fillSubcategories($('#field_ebook').find('option:selected').attr('data-file-versions'));
                  }

      });

      $('#field_type').on('change', function () {
          $('.elearning-sections').hide();
          $('.elearning-sections.elearning-' + this.value).show();
      });

      $('.elearning-sections').hide();

      $('#btn_send').on('click', function () {
          verifCourse(this);
      });
    }
  }

})(jQuery);
