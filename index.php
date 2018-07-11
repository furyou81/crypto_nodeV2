<?PHP
if ($_POST['SSID']) {
	$ssid = $_POST['SSID'];
	$pass = $_POST['PASS'];
	echo "network setted";
	$data = file_get_contents("/etc/wpa_supplicant/wpa_supplicant.conf");
	$data .= "network={\n" ."	ssid=\"$ssid\"\n";
	if($pass != "") 
		$data .= "	psk=\"$pass\"\n";
	else
		$data .= "	key_mgmt=NONE\n";
	$data .= "}\n";
	file_put_contents("/etc/wpa_supplicant/wpa_supplicant.conf", $data);
	echo exec("sudo sh /var/www/html/wifi.sh");
	//echo exec("pwd");
}
?>

<title>Crypto transfer</title>
<form action="" method="post">
<input type="text" name="SSID" placeholder="Please put the SSID">
<input type="text" name="PASS" placeholder="Please put the PASSWORD">
<input type="submit" value="OK">
</form>
