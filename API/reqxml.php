<?php
if($_GET['url']){

    $urlXml=$_GET['url'];

    header('Content-type:application/xml');

    $fp = file_get_contents($urlXml) or die("can not open $urlXml");

    echo $fp;

}else{

    header('Location: /');

}