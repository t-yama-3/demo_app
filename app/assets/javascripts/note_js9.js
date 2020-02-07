window.addEventListener("load", function() {
  let token = document.getElementsByName("csrf-token")[0].content; //セキュリティトークンの取得
  // 追加するDOMノード（HTMLデータ）を生成する関数
  function createHTML(note) {
    let strHtml = '<div class="note" id="note' + note.id + '">' +
                    '<span class="note_name">投稿者：' + note.user_name + '</span>' +
                    '<a class="note_delete" rel="nofollow" data-method="delete" href="/notes/' + note.id + '"> 削除</a>' +
                    '<p class="note_body">' + note.body + '</p>' +
                  '</div>';
    let divElm = document.createElement("div");  // divタグを持つノードを作成
    divElm.innerHTML = strHtml;  // 文字列（strHtml）をinnerHTMLとして代入する際にDOMノードに変換される
    let deleteElm = divElm.getElementsByClassName("note_delete")[0];  // イベントリスナーを登録する要素を特定する
    deleteElm.addEventListener("click", function(e) { deleteHTMLEvent(e, deleteElm) }, false);  // イベントリスナーの追加（動的追加）
    return divElm.children[0];  // 子要素を返す（必要なDOMノードが戻り値となる）
  };

  // ハッシュ(連想配列)をURI(UTF-8)にエンコードする関数
  function encodeURIFromHash(data, stockKey="", prefix="&", suffix="") {
    let resultStr = "";  // URIエンコードした文字列を格納する変数
    if (typeof(data) === "object") {  // 対象データがオブジェクトである場合は再帰呼出しを行う
      Object.keys(data).forEach(function(key) {  // 要素の数だけループ処理
        resultStr += encodeURIFromHash(data[key], stockKey + prefix + encodeURIComponent(key) + suffix, "[", "]");
      });
    } else {  // 対象データがオブジェクトでなければURIエンコードをした上で確定する
      resultStr = stockKey + "=" + encodeURIComponent(data);
    }
    if (stockKey === "") { resultStr = resultStr.slice(1); }  //１文字目の不要な"&"又は"="を削除
    return resultStr;
  }

  // メモ投稿(POSTメソッド)の処理
  let addHTMLEvent = function(e) {
    e.preventDefault();  // デフォルトのイベント（HTMLデータ送信など）を無効にする
    //送信データの生成
    let inputText = document.getElementsByClassName("note_form-text")[0].value;  // textareaの入力値を取得
    let url = document.getElementById("note_input").getAttribute("action");  // 末尾に[.json]を追加して送信データがjson形式であることを指定
    let hashData = {  // 送信するデータをハッシュ形式で指定
      note: {
        body: inputText,
      },
      text: "こんにちは",
      user: {
        name: "山田太郎",
        email: "taro@yamada.com",
      },
      authenticity_token: token  // セキュリティトークンの送信（ここから送信することも可能）
    };
    let data = encodeURIFromHash(hashData);

    // Ajax通信を実行
    let xmlHR = new XMLHttpRequest();  // XMLHttpRequestオブジェクトの作成
    xmlHR.open("POST", url, true);  // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
    // xmlHR.setRequestHeader("Accept", "application/json");  // リクエストヘッダーを追加（クライアントが理解できるコンテンツタイプを通知）
    xmlHR.setRequestHeader("Accept", "application/json, text/javascript");  // リクエストヘッダーを追加（クライアントが理解できるコンテンツタイプを通知）
    // xmlHR.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");  // リクエストヘッダーを追加（クライアントが理解できるコンテンツタイプを通知）
    // xmlHR.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");  // リクエストヘッダーを追加（クライアントが理解できるコンテンツタイプを通知）
    xmlHR.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
    xmlHR.responseType = "json";  // レスポンスデータをjson形式と指定（textで受信してもJSON.parseでデコードは可能）
    xmlHR.send(data);  // sendメソッドでサーバに送信

    // 受信したデータの処理
    xmlHR.onreadystatechange = function() {
      if (xmlHR.readyState === 4) {  // readyStateが4になればデータの読込み完了
        if (xmlHR.status === 200) {  // statusが200の場合はリクエストが成功
          let note = xmlHR.response;  // 受信したjsonデータを変数noteに格納
          console.log(note);
          const startTime = performance.now();
          let html = createHTML(note);  // 受信データを元にHTMLを作成
          const endTime = performance.now();
          console.log((endTime - startTime).toFixed(3));
          // let html = createHTML(JSON.parse(note));  // 受信データを元にHTMLを作成
          document.getElementsByClassName("notes")[0].appendChild(html);  // 作成したHTMLをドキュメントに追加

          // let tmpElm = document.createElement("html");
          // tmpElm.innerHTML = xmlHR.responseText;
          // let bodyHTML = tmpElm.getElementsByTagName("body")[0]
          // let elements = bodyHTML.innerHTML
          // document.body.innerHTML = elements;
          // document.getElementById("note_input").addEventListener("submit", addHTMLEvent, false);
          // let noteDeletes = document.getElementsByClassName("note_delete")
          // Array.prototype.forEach.call(noteDeletes, function(noteDelete) {
          //   noteDelete.addEventListener("click", function(e) { deleteHTMLEvent(e, noteDelete) }, false);
          // });

          document.getElementsByClassName("note_form-text")[0].value = "";  // テキストエリアを空白に戻す
        } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
          alert("error");
        }
        document.getElementsByClassName("note_form-btn")[0].disabled = false;  // submitボタンのdisableを解除
        document.getElementsByClassName("note_form-btn")[0].removeAttribute("data-disable-with");  // submitボタンのdisableを解除(Rails5.0以降はこちらも必要)
      }
    };
  };
  document.getElementById("note_input").addEventListener("submit", addHTMLEvent, false);

  // 削除イベントの処理
  let deleteHTMLEvent = function(e, noteDelete) {
    e.preventDefault();
    e.stopPropagation();
    let url = noteDelete.getAttribute("href"); //末尾に .json を追加することで送信データがjson形式であることを指定する
    // let url = noteDelete.getAttribute("href") + ".json"; //末尾に .json を追加することで送信データがjson形式であることを指定する
    // Ajax通信を実行
    let xmlHR = new XMLHttpRequest(); //XMLHttpRequestの作成
    xmlHR.open("DELETE", url, true); //open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
    xmlHR.responseType = "json"; //レスポンスデータを json形式と指定する
    xmlHR.setRequestHeader("Content-Type", "application/json");  // リクエストヘッダーを追加(HTTP通信でJSONを送る際のルール)
    xmlHR.setRequestHeader("Accept", "application/json, text/javascript");  // リクエストヘッダーを追加（クライアントが理解できるコンテンツタイプを通知）
    xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
    xmlHR.send(); //サーバに送信
    // 受信したデータの処理
    xmlHR.onreadystatechange = function() {
      if (xmlHR.readyState === 4) {
        if (xmlHR.status === 200) {
          let note = xmlHR.response;
          document.getElementById("note" + note.id).remove();
        } else {
          alert(xmlHR.status);
        }
      }
    };
  };
  let noteDeletes = document.getElementsByClassName("note_delete")
  Array.prototype.forEach.call(noteDeletes, function(noteDelete) {
    noteDelete.addEventListener("click", function(e) { deleteHTMLEvent(e, noteDelete) }, false);
  });
});
