<?php
    $jarr=array('total'=>2,'row'=>array(
               array('code'=>'001','name'=>'China','addr'=>'Address 11','col4'=>'col4 data'),
               array('code'=>'002','name'=>'America','addr'=>'Address 12','col4'=>'col4 data')
               )
               );

    echo json_encode($jarr);//将数组进行json编码