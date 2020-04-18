document.addEventListener(
  "DOMContentLoaded", e => {
    if (document.getElementById('token_submit') != null) {
      Payjp.setPublicKey('pk_test_6a23cbc185cf21b00610bbb5');
      document.getElementById('token_submit').addEventListener('click', e => {
        e.preventDefault();
        let card = {
          number: document.getElementById('card_number').value,
          cvc: document.getElementById('cvc').value,
          exp_month: document.getElementById('exp_month').value,
          exp_year: document.getElementById('exp_year').value
        };
        Payjp.createToken(card, (status, response) => {
          console.log(status);
          console.log(response);
          if (status == 200) {
            document.getElementById('card_token').setAttribute("value", response.id);
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