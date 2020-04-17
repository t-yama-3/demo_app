document.addEventListener(
  "DOMContentLoaded", e => {
    if (document.getElementById('token_submit') != null) {
      Payjp.setPublicKey('pk_test_6a23cbc185cf21b00610bbb5');
      let btn = document.getElementById('token_submit');
      btn.addEventListener('click', e => {
        e.preventDefault();
        let card = {
          number: document.getElementById('card_number').value,
          cvc: document.getElementById('cvc').value,
          exp_month: document.getElementById('exp_month').value,
          exp_year: document.getElementById('exp_year').value
        };
        Payjp.createToken(card, (status, response) => {
          console.log(status);
          if (status == 200) {
            $('#card_number').removeAttr('name');
            $('#cvc').removeAttr('name');
            $('#exp_month').removeAttr('name');
            $('#exp_year').removeAttr('name');
            $('#card_token').append(
              $('<input type="hidden" name="payjp-token">').val(response.id)
            );
            document.inputForm.submit();
            alert('登録しました');
          } else {
            alert('カード情報が正しくありません');
          }
        });
      });
    }
  },
  false
);