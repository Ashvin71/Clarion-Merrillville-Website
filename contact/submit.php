<?php
declare(strict_types=1);

const HOTEL_EMAIL = '58541wyndham@gmail.com';

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function respond(string $title, string $message, bool $success = false, int $status = 200): never
{
    http_response_code($status);
    $safeTitle = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $accent = $success ? '#2f6a4f' : '#7c2534';
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<meta name="robots" content="noindex"><title>' . $safeTitle . ' | Clarion Inn Merrillville</title>';
    echo '<style>body{margin:0;font:16px/1.6 Arial,sans-serif;color:#252525;background:#f4f0ea;display:grid;place-items:center;min-height:100vh;padding:20px;box-sizing:border-box}.box{max-width:620px;background:#fff;padding:42px;box-shadow:0 18px 50px #0002;border-top:5px solid ' . $accent . '}h1{font:400 2.2rem/1.15 Georgia,serif;margin-top:0}a{display:inline-block;margin:8px 8px 0 0;padding:11px 18px;background:#7c2534;color:#fff;text-decoration:none;font-weight:bold}</style></head><body><main class="box">';
    echo '<h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p><a href="../contact.html">Return to Contact</a><a href="tel:+12194173611">Call (219) 417-3611</a></main></body></html>';
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond('Form Not Submitted', 'Please use the contact form to send a message.', false, 405);
}

if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond('Thank You', 'Your message has been received.', true);
}

$name = trim(strip_tags((string)($_POST['name'] ?? '')));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim(strip_tags((string)($_POST['phone'] ?? '')));
$subject = trim(strip_tags((string)($_POST['subject'] ?? '')));
$arrival = trim(strip_tags((string)($_POST['arrival'] ?? '')));
$departure = trim(strip_tags((string)($_POST['departure'] ?? '')));
$message = trim(strip_tags((string)($_POST['message'] ?? '')));

foreach ([$name, $email, $subject] as $headerValue) {
    if (preg_match('/[\r\n]/', $headerValue)) {
        respond('Unable to Send Message', 'The submitted information contains invalid characters. Please review the form or call the hotel.', false, 400);
    }
}

if ($name === '' || text_length($name) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL) || text_length($email) > 150 || $subject === '' || text_length($subject) > 120 || $message === '' || text_length($message) > 3000) {
    respond('Please Review the Form', 'Name, a valid email address, subject and message are required. Please correct the form and try again.', false, 422);
}

if (text_length($phone) > 40 || ($arrival !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $arrival)) || ($departure !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $departure))) {
    respond('Please Review the Form', 'One or more optional fields are not in the expected format.', false, 422);
}

if ($arrival !== '' && $departure !== '' && $departure <= $arrival) {
    respond('Please Review the Dates', 'The departure date must be after the arrival date.', false, 422);
}

$mailSubject = 'Clarion Inn website inquiry: ' . $subject;
$body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nArrival: {$arrival}\nDeparture: {$departure}\nSubject: {$subject}\n\nMessage:\n{$message}\n";
$headers = [
    'From: Clarion Inn Website <' . HOTEL_EMAIL . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = @mail(HOTEL_EMAIL, $mailSubject, $body, implode("\r\n", $headers));
if (!$sent) {
    respond('Message Could Not Be Sent', 'The website mail service is not available right now. Please call (219) 417-3611 or email 58541wyndham@gmail.com directly.', false, 503);
}

respond('Message Sent', 'Thank you for contacting Clarion Inn Merrillville. The hotel has received your message and will respond using the contact information you provided.', true);
