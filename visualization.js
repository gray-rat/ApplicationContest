'use strict';
// 変数の取得
const clickButton = document.getElementById('inputButton');
const clickMakepiechart = document.getElementById('clickMakepychart');
const clickMakeTable = document.getElementById('makeTable');
const paymentDate = document.getElementById('paymentDate');
const mainGenre = document.getElementById('mainGenre');
const subGenre = document.getElementById('subGenre');
const memo = document.getElementById('memo');
const paymentAmount = document.getElementById('paymentAmount');

let canvas = document.getElementById("piechart");
let canvasClick = document.getElementById("testMakePiechart");
let sumPaymentAll = 0;
//集計用の配列
let paymentDateMap = new Map();
let paymentMainGunre = new Map();
let paymentSubGunre = new Map();
//グラフ作成用
let sharePaymentDate = new Map();
let shareMainGunre = new Map();
let shareSubGunre = new Map();

// それぞれの値をたせる多次元配列
let bar = new Array();
// 支出項目のプルダウン
const paymentMenu =
{
  "固定支出": ["家賃", "光熱費", "水道", "通信費(固定回線)", "通信費(スマホ)", "定期代", "サブスクサービス", "学費", "習い事"],
  "変動支出": ["外食", "遊興", "食料品", "書籍", "ゲーム", "被服", "トイレタリー", "医療費"],
  "その他": ["その他"]
};

//2重のプルダウン作成
function createMenu(selectGenre) {
  subGenre.disabled = false;
  subGenre.innerHTML = '';
  let option = document.createElement('option');
  option.innerHTML = '詳細を選択してください';
  option.defaultSelected = true;
  option.disabled = true;
  subGenre.appendChild(option);

  paymentMenu[selectGenre].forEach(menu => {
    let option = document.createElement('option');
    option.innerHTML = menu;
    subGenre.appendChild(option);
  });
}

//送信ボタンが押された時各入力値をコンソールに出力
//TODO 送信ボタンを押すたびに初期化
//TODO　データチェック（型,マイナス金額,欠損）
clickButton.onclick = function () {
  //入力内容の配列
  const barColumns = new Array();
  barColumns.push(paymentDate.value);
  barColumns.push(mainGenre.value);
  barColumns.push(subGenre.value);
  barColumns.push(paymentAmount.value);
  barColumns.push(memo.value);
  bar.push(barColumns);
  console.log(bar);
  for (let i = 0; i < bar.length; i++) {
    console.log(bar[i]);
  }
  console.log('入力ボタンが押されました');
};

//支払い合計金額の集計
clickMakepiechart.onclick = function () {
  console.log('集計ボタンが押されました');
  bar.forEach(function (value) {
    //金額の集計
    sumPaymentAll += parseFloat(value[3]);
    console.log('支払い料金' + value[3]);
    console.log(sumPaymentAll);
  });

  //各集計項目ごとに連想配列を作成

  //1 of 3:日付別の支出金額の連想配列
  bar.forEach(function (value) {
    if (value[0] in paymentDateMap) {
      //キーがすでにある場合既存の集計結果に数字を加える
      paymentDateMap[value[0]] = parseFloat(paymentDateMap[value[0]]) + parseFloat(value[3]);
      console.log(paymentDateMap);
      paymentDateMap.forEach(element => {
        console.log(element);
      });

    } else {
      //キーがない場合は新規にキーと値を連想配列に加える
      paymentDateMap[value[0]] = parseFloat(value[3]);
      console.log('新規キー' + value[0]);
      console.log('新規値' + value[3]);
      console.log('連想配列の表示:' + paymentDateMap[value[0]]);
    };
    //項目別に支出金額の割合を計算円グラフを作成用
    for (let key in paymentDateMap) {
      sharePaymentDate[key] = parseFloat(paymentDateMap[key]) / sumPaymentAll
    }
  });


  //2 of 3:大項目別の支出金額の連想配列を作成
  bar.forEach(function (value) {
    if (value[1] in paymentMainGunre) {
      //キーがすでにある場合既存の集計結果に数字を加える
      paymentMainGunre[value[1]] = parseFloat(paymentMainGunre[value[1]]) + parseFloat(value[3]);
      console.log(paymentMainGunre);
      paymentMainGunre.forEach(element => {
        console.log(element);
      });

    } else {
      //キーがない場合は新規にキーと値を連想配列に加える
      paymentMainGunre[value[1]] = parseFloat(value[3]);
    };
    //項目別に支出金額の割合を計算円グラフを作成用
    for (let key in paymentMainGunre) {
      shareMainGunre[key] = parseFloat(paymentMainGunre[key]) / sumPaymentAll
    }
  });

  //3 of 3:小項目別の支出金額の連想配列を作成
  bar.forEach(function (value) {
    if (value[2] in paymentSubGunre) {
      //キーがすでにある場合既存の集計結果に数字を加える
      paymentSubGunre[value[2]] = parseFloat(paymentSubGunre[value[2]]) + parseFloat(value[3]);
      console.log(paymentSubGunre);
      paymentSubGunre.forEach(element => {
        console.log(element);
      });

    } else {
      //キーがない場合は新規にキーと値を連想配列に加える
      paymentSubGunre[value[2]] = parseFloat(value[3]);
    };
    for (let key in paymentSubGunre) {
      shareSubGunre[key] = parseFloat(paymentSubGunre[key]) / sumPaymentAll
    }
  });
};

//テーブルの作成
clickMakeTable.onclick = function () {
  const body = document.getElementsByTagName("body")[0];

  //テーブルを作成
  const tbl = document.getElementById("table");
  const tblBody = document.createElement("tbody");;

  //セルの作成
  for (let i = 0; i < 5; i++) {
    //テーブルの行を作成
    let row = document.createElement("td");

    for (let j = 0; j < bar.length; j++) {
      let cell = document.createElement("tr");
      let cellText = document.createTextNode(bar[j][i]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    //table bodyの最後に追加
    tblBody.appendChild(row);
  }
  //<tbody>タグを<table>タグに追加 
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);

  //canvasによる3つの円グラフの作成
  let context = canvas.getContext("2d");
  //グラフ作成用
  let angleEnd = 0;
  let angleStart = 0;
  //円グラフの塗り分け
  const graphColor = ["orange", "blue", "green", "silver", "greenyellow", "gray", "olive", "gold", "navy", "khaki",
    "yellow", "pink", "red", "white", "cyan", "lime", "lightgray", "darkorange"];

  //日付別の円グラフ
  Object.keys(sharePaymentDate).forEach(function (key, counter = 0) {
    let dataLabel = key + ":" + parseInt(sharePaymentDate[key] * 100) + "%";
    context.fillStyle = graphColor[counter];
    counter += 1;
    //let graphTitle = toString(key + ":" + sharePaymentDate[key] + "%");
    //円の始点と円の終点
    angleStart = angleEnd;
    angleEnd += 360 * sharePaymentDate[key];
    context.beginPath();
    context.arc(100, 200, 100, (angleStart - 90) * Math.PI / 180, (angleEnd - 90) * Math.PI / 180, false);
    context.lineTo(100, 200);
    context.fill();
    //凡例
    context.font = "20px 'ＭＳ ゴシック'";
    context.fillText(dataLabel, 200, 50 + 30 * counter);
    //グラフタイトル
    context.fillStyle = "black";
    context.font = "25px 'ＭＳ ゴシック'";
    context.fillText("日付別集計", 40, 50);
  });

  //項目の円グラフ
  Object.keys(shareMainGunre).forEach(function (key, counter = 0) {
    let dataLabel = key + ":" + parseInt(shareMainGunre[key] * 100) + "%";
    context.fillStyle = graphColor[counter];
    counter += 1;
    //円の始点と円の終点
    angleStart = angleEnd;
    angleEnd += 360 * shareMainGunre[key];
    console.log("始点" + angleStart);
    console.log("終点" + angleEnd);
    console.log("カウンター" + counter);

    context.beginPath();
    context.arc(500, 200, 100, (angleStart - 90) * Math.PI / 180, (angleEnd - 90) * Math.PI / 180, false);
    context.lineTo(500, 200);
    context.fill();
    //凡例
    context.font = "20px 'ＭＳ ゴシック'";
    context.fillText(dataLabel, 600, 50 + 30 * counter);
    //グラフタイトル
    context.fillStyle = "black";
    context.font = "25px 'ＭＳ ゴシック'";
    context.fillText("項目別集計", 440, 50);
  });

  //明細の円グラフ
  Object.keys(shareSubGunre).forEach(function (key, counter = 0) {
    let dataLabel = key + ":" + parseInt(shareSubGunre[key] * 100) + "%";
    context.fillStyle = graphColor[counter];
    counter += 1;
    //円の始点と円の終点
    angleStart = angleEnd;
    angleEnd += 360 * shareSubGunre[key];
    context.beginPath();
    context.arc(900, 200, 100, (angleStart - 90) * Math.PI / 180, (angleEnd - 90) * Math.PI / 180, false);
    context.lineTo(900, 200);
    context.fill();
    //凡例
    context.font = "20px 'ＭＳ ゴシック'";
    context.fillText(dataLabel, 1000, 50 + 30 * counter);
    //グラフタイトル
    context.fillStyle = "black";
    context.font = "25px 'sans-serif'";
    context.fillText("明細別集計", 840, 50);
  });
};