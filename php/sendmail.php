<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '/home/appuser/vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    //$mail->SMTPDebug = SMTP::DEBUG_SERVER; 
    $mail->isSMTP();
    $mail->Host       = 'smtp-relay.gmail.com';
    // Setting from gsuite is ip only without SMTPAuth
    //$mail->SMTPAuth   = true;
    //$mail->Username   = 'user@example.com'; 
    //$mail->Password   = 'secret'; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    //Recipients
    //Recipients
    $mail->setFrom('nobody@phoenixcel.com', 'NoBody');
    //$mail->addAddress($_POST['email'], $_POST['first_name'].' '.$_POST['last_name']);
    $mail->addAddress('sales@phoenixcel.com', 'Phoenixcel Sales');
    //$mail->addCC($from, $name);
    //$mail->addBCC($from, $name);
    $mail->addReplyTo('nobody@phoenixcel.com', 'NoBody');
    //$mail->addReplyTo('info@phoenixcel.com', 'Phoenixcel');

    // Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = '[FORM$SALES]';

    $message = '<html><body>';
    //$message .= '<img src="//css-tricks.com/examples/WebsiteChangeRequestForm/images/wcrf-header.png" alt="Website Change Request" />';
    $message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
    $message .= "<tr><td>First Name:</td><td>" . strip_tags($_POST['first_name']) . "</td></tr>";
    $message .= "<tr><td>Last Name:</td><td>" . strip_tags($_POST['last_name']) . "</td></tr>";
    $message .= "<tr><td>Organization/Company:</td><td>" . strip_tags($_POST['organization']) . "</td></tr>";
    $message .= "<tr><td>Tilte:</td><td>" . strip_tags($_POST['title']) . "</td></tr>";
    $message .= "<tr><td>Email:</td><td>" . strip_tags($_POST['email']) . "</td></tr>";
    $message .= "<tr><td>Phone:</td><td>" . strip_tags($_POST['phone']) . "</td></tr>";
    //$message .= "<tr><td>Type of Change:</td><td>" . strip_tags($_POST['typeOfChange']) . "</td></tr>";
    $message .= "<tr><td>Message:</td><td>" . $_POST['message'] . "</td></tr>";
    $message .= "<tr><td>Raw:</td><td>" . implode('||', $_POST). "</td></tr>";
    // $addURLS = $_POST['addURLS'];
    // if (($addURLS) != '') {
    //     $message .= "<tr><td>URL To Change (additional):</td><td>" . strip_tags($addURLS) . "</td></tr>";
    // }
    // $curText = htmlentities($_POST['curText']);
    // if (($curText) != '') {
    //     $message .= "<tr><td>CURRENT Content:</td><td>" . $curText . "</td></tr>";
    // }
    // $message .= "<tr><td>NEW Content:</td><td>" . htmlentities($_POST['newText']) . "</td></tr>";
    $message .= "</table>";
    $message .= "</body></html>";

    $mail->Body    = $message;
    $mail->AltBody = file_get_contents("php://input"); //$_POST

    if ($mail->send()) {
        echo '<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>';
    } else {
        echo 'Send mail error';
    }
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
