<?php
// this is just a helper file for DDEV, redirect to our app when using `ddev launch`
$redirect = 'https://app.'.$_SERVER['DDEV_SITENAME'].'.'.$_SERVER['DDEV_TLD'];
header('Location: '.$redirect);