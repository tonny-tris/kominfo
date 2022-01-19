import 'dart:async';
import 'package:flutter/material.dart';

class Init extends StatefulWidget {
  InitState createState() => InitState();
}

class InitState extends State<Init> {
  static initialize() async {
    await timer();
  }

  static timer() async {
    await Future.delayed(const Duration(seconds: 2));
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }
}
