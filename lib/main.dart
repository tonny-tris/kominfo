import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_downloader/flutter_downloader.dart';
import 'package:downloads_path_provider_28/downloads_path_provider_28.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_file/open_file.dart';
import 'package:signature/splash/init.dart';
import 'package:signature/splash/splash.dart';
import 'package:fluttertoast/fluttertoast.dart';

InAppLocalhostServer localhostServer = new InAppLocalhostServer();
Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isAndroid) {
    await AndroidInAppWebViewController.setWebContentsDebuggingEnabled(true);
  }
  await localhostServer.start();
  runApp(MaterialApp(
    home: RequestedFileManager(),
  ));
}

class RequestedFileManager extends StatefulWidget {
  RequestedFileManagerState createState() => RequestedFileManagerState();
}

class RequestedFileManagerState extends State<RequestedFileManager> {
  void initState() {
    super.initState();
    requestfilemanager();
  }

  requestfilemanager() async {
    if (await Permission.storage.isGranted == false) {
      // ignore: unused_local_variable
      Map<Permission, PermissionStatus> statuses = await [
        Permission.storage,
      ].request();
      if (await Permission.storage.isGranted == false) {
        SystemChannels.platform.invokeMethod('SystemNavigator.pop');
      } else {
        runApp(MaterialApp(home: Splash()));
      }
    } else {
      runApp(MaterialApp(home: Splash()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff083142),
      body: Center(child: Container()),
    );
  }
}

class Splash extends StatefulWidget {
  SplashState createState() => SplashState();
}

class SplashState extends State<Splash> {
  final Future _initFuture = InitState.initialize();
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Signature',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.light,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: FutureBuilder(
          future: _initFuture,
          // ignore: missing_return
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return MyApp();
            } else {
              return SplashScreen();
            }
          }),
    );
  }
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => new _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // InAppWebViewController? _webViewController;
  // final String homeUrl = "http://127.0.0.1:8080/assets/website/index.html";
  InAppWebViewController? webView;
  String url = "http://127.0.0.1:8080/assets/website/index.html";
  double progress = 0;
  late Directory downloadsDirectory;
  Random random = new Random();
  int randomNumber = 0;
  String namaBerkas = "";
  late DateTime currentBackPressTime;

  @override
  void initState() {
    super.initState();
    direktori();
    randomNumber = random.nextInt(100000000);
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future direktori() async {
    await Permission.storage.request();
    downloadsDirectory = (await DownloadsPathProvider.downloadsDirectory)!;
    await FlutterDownloader.initialize(debug: false);
  }

  _createPdfFromBase64(
      String base64content, String namaFile, String alamatPath) async {
    var bytes = base64Decode(base64content.replaceAll('\n', ''));
    Directory? output = await DownloadsPathProvider.downloadsDirectory;
    await Directory('${output!.path}/KominfoSignature').create(recursive: true);
    File file = File("${output.path}/KominfoSignature/$namaFile.$alamatPath");
    await file.writeAsBytes(bytes.buffer.asUint8List());
    await OpenFile.open(
        "${output.path}/KominfoSignature/$namaFile.$alamatPath");
    setState(() {
      Fluttertoast.showToast(
        msg: "Buka Folder Download $namaFile.$alamatPath",
        toastLength: Toast.LENGTH_LONG,
        gravity: ToastGravity.TOP,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('E-Signature'),
        ),
        body: Container(
            child: Column(children: <Widget>[
          Container(
              padding: EdgeInsets.all(10.0),
              child: progress < 1.0
                  ? LinearProgressIndicator(value: progress)
                  : Container()),
          Expanded(
            child: Container(
              margin: const EdgeInsets.fromLTRB(10, 10, 10, 0),
              decoration:
                  BoxDecoration(border: Border.all(color: Colors.blueAccent)),
              child: InAppWebView(
                onDownloadStart: (controller, url) async {
                  randomNumber = random.nextInt(100000000);
                  namaBerkas = "KominfoSignature_" + randomNumber.toString();
                  var jsContent =
                      await rootBundle.loadString("assets/website/base64.js");
                  await controller.evaluateJavascript(
                      source:
                          jsContent.replaceAll("blobUrlPlaceholder", "$url"));
                },
                initialUrlRequest: URLRequest(url: Uri.parse(url)),
                initialOptions: InAppWebViewGroupOptions(
                    crossPlatform: InAppWebViewOptions(
                      useOnDownloadStart: true,
                    ),
                    ios: IOSInAppWebViewOptions(),
                    android: AndroidInAppWebViewOptions(
                      useHybridComposition: true,
                    )),
                onWebViewCreated: (InAppWebViewController controller) {
                  webView = controller;
                  controller.addJavaScriptHandler(
                    handlerName: "blobToBase64Handler",
                    callback: (data) {
                      String receivedEncodedValueFromJs = data[0];
                      String receivedMimeType = data[1];
                      _createPdfFromBase64(
                          receivedEncodedValueFromJs, namaBerkas, "pdf");
                    },
                  );
                },
                onLoadStart: (controller, url) {
                  setState(() {
                    this.url = url?.toString() ?? '';
                  });
                },
                onLoadStop: (controller, url) async {
                  setState(() {
                    this.url = url?.toString() ?? '';
                  });
                },
                onProgressChanged: (controller, progress) {
                  setState(() {
                    this.progress = progress / 100;
                  });
                },
              ),
            ),
          ),
          ButtonBar(
            alignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                child: Icon(Icons.refresh),
                onPressed: () {
                  webView?.reload();
                },
              ),
            ],
          ),
        ])),
      ),
    );
  }
}
