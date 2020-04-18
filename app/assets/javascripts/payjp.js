document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById('token_submit') == null) { return; }  // 対象外のページの場合はreturn
  Payjp.setPublicKey('pk_test_6a23cbc185cf21b00610bbb5');  // 公開鍵を設定
  document.getElementById('token_submit').addEventListener('click', function(e) {
    e.preventDefault();
    let card = {
      number: document.getElementById('number').value,
      cvc: document.getElementById('cvc').value,
      exp_month: document.getElementById('exp_month').value,
      exp_year: document.getElementById('exp_year').value
    };
    // PayjpオブジェクトのcreateTokenメソッドでpayjpのサーバと通信する（カード情報の認証とトークンの発行）
    Payjp.createToken(card, function(status, response) {
      if (status == 200) {
        document.getElementById('payjp_token').setAttribute("value", response.id);  // payjpとの通信で取得したトークンをフォームに格納
        document.inputForm.submit();  // フォーム名を指定して登録情報をアプリケーションのサーバに送信
      } else {
        alert('カード情報が正しくありません');
      }
    });
  });
});