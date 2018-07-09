<?
    if ($_GET["connect"]) {
        system("echo \"".$_GET["connect"]."#####".$_GET["pass"]."\" > test.out");
        echo "configuration sauvegarde pour le reseau ".$_GET["connect"]."<br>";
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CryptoTransfert</title>
</head>
<body>
    wifi :
    <ul>
        <?php
            $scan = file_get_contents("scan.wifi.txt");
            foreach (explode("\n", $scan) as $wifi)
                if ($wifi !== "") {
                    $wifi = explode(" ", $wifi);
                    $wifi_security = array_pop($wifi);
                    $wifi_name = implode(" ", $wifi);
                    echo "<li>";
                    if ($wifi_security == "--"):?>
                        <a href="?connect=<?=urlencode($wifi_name);?>">
                            <?=$wifi_name;?>
                        </a>
                    <?else:?>
                        <a onclick="return connect(this)" name="<?=$wifi_name;?>" href="?connect=<?=urlencode($wifi_name);?>">
                            <?=$wifi_name;?>
                            <span>🔐</span>
                        </a>
                    <?endif;
                    echo "</li>";
                }
        ?>
    </ul>
    <script>function connect(a) {
        pass = prompt("Veillez saisir le mot de passe du reseau:\n" + a.name);
        if (pass) {
            a.href += "&pass="+encodeURIComponent(pass);
            return true;
        }
        return false;
    }
    </script>
</body>
</html>