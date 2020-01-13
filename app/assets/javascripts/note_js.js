window.addEventListener("load", function() {
  // 追加するHTMLデータを生成する関数
  function buildHTML(note) {
    let elm_div_parent = document.createElement("div");
    let elm_div_child1 = document.createElement("div");
    let elm_div_child2 = document.createElement("div");
    let elm_a = document.createElement("a");
    let elm_p = document.createElement("p");
    let text_name = document.createTextNode("投稿者：" + note.user_name);
    let text_sakujo = document.createTextNode(" 削除");
    let text_body = document.createTextNode(note.body);

    elm_div_parent.setAttribute("class", "note");
    elm_div_child1.setAttribute("class", "note_name");
    elm_p.setAttribute("class", "note_body");
    elm_a.setAttribute("href", "/notes/" + note.id);
    elm_a.setAttribute("class", "note_option");
    elm_a.setAttribute("rel", "nofollow");
    elm_a.setAttribute("data-method", "delete");

    elm_div_child1.appendChild(text_name);
    elm_a.appendChild(text_sakujo);
    elm_div_child1.appendChild(elm_a);
    
    elm_p.appendChild(text_body);
    elm_div_child2.appendChild(elm_p);
    
    elm_div_parent.appendChild(elm_div_child1);
    elm_div_parent.appendChild(elm_div_child2);

    return elm_div_parent;
  }

  let note_form = document.getElementById("note-id");
  if (note_form === null) { return; } //トップページでエラーが起きるので念のため（これが無くとも影響はないと思います）
  note_form.addEventListener("submit", function(e) {
    e.preventDefault(); //デフォルトのイベントを無効にする
    let input_text = document.getElementsByClassName("note_form-text")[0].value; //textareaの入力値を取得
    let token = document.getElementsByName("csrf-token")[0].content; //tokenの取得（標準の指定）
    // let token = document.getElementsByName("authenticity_token")[0].getAttribute("value");
    let url = $(this).attr("action") + ".json"; //location.hrefで現在のURLを取得（末尾に .json を追加することで送信データがjson形式であることを指定する）
    let json_data = {
      authenticity_token: token,
      note: {body: input_text},
    };
    let data = JSON.stringify(json_data); //送信用のjson形式に変換

    let xmlHR = new XMLHttpRequest(); //XMLHttpRequestの作成
    xmlHR.open("POST", url, true); //open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
    xmlHR.responseType = "json"; //レスポンスデータを json形式と指定する
    xmlHR.setRequestHeader("Content-Type", "application/json"); //ajax通信でリクエストヘッダーを追加
    xmlHR.send(data); //サーバに送信
    
    xmlHR.onreadystatechange = function() {
      if (xmlHR.readyState === 4) {
        if (xmlHR.status === 200) {
          let json = xmlHR.response;
          let html = buildHTML(json);
          document.getElementsByClassName("notes")[0].appendChild(html);
          document.getElementsByClassName("note_form-text")[0].value = "";
        } else {
          alert("error");
        }
        document.getElementsByClassName("note_form-btn")[0].removeAttribute("data-disable-with");  // submitボタンのdisableを解除
        // document.getElementsByClassName("note_form-btn")[0].disabled = false;  // 環境によってはこちらを使用
      }
    };
  });
});
