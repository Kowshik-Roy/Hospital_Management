<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\SymptomChecker;

class AiAssistantController extends Controller
{
    /**
     * AI Medical Assistant & Patient Support Chatbot
     */
    public function chat(Request $request)
    {
        $message = $request->input('message');
        $history = $request->input('history', []);
        $language = $request->input('language', 'bn');

        if (!$message) {
            return response()->json(['error' => 'Message is required'], 400);
        }

        $apiKey = env('GEMINI_API_KEY');

        // Fallbacks when API key is not configured or in offline test mode
        $fallbackBn = "নমস্কার! আমি কেয়ারপাল্স হসপিটাল এর এআই মেডিকেল অ্যাসিস্ট্যান্ট (CarePulse AI)। " .
            "আমি আপনাকে ডাক্তারদের সময়সূচী, অ্যাপয়েন্টমেন্ট বুকিং, জরুরী অ্যাম্বুলেন্স সেবা এবং প্রাথমিক স্বাস্থ্য পরামর্শে সাহায্য করতে পারি। " .
            "জরুরী প্রয়োজনে আমাদের হটলাইন ১৬২৬৩ বা ৯৯৯ এ কল করুন। আপনার কী সাহায্য প্রয়োজন?";

        $fallbackEn = "Hello! I am CarePulse Hospital's AI Healthcare Assistant. " .
            "I can assist you with doctor schedules, appointment bookings, emergency services, and department guidance. " .
            "For critical emergencies, please dial 999 or our 24/7 hotline 16263. How can I help you today?";

        $suggestedActions = $language === 'bn' ? [
            'আজকে কোন কোন ডাক্তার আছেন?',
            'জরুরী অ্যাম্বুলেন্স নম্বর কত?',
            'প্রেসক্রিপশন কীভাবে পাব?'
        ] : [
            'Which doctors are on duty today?',
            'Emergency ambulance helpline?',
            'How do I view my prescription?'
        ];

        if (!$apiKey || $apiKey === 'MY_GEMINI_API_KEY') {
            return response()->json([
                'reply' => $language === 'bn' ? $fallbackBn : $fallbackEn,
                'suggestedActions' => $suggestedActions,
            ]);
        }

        try {
            $systemInstruction = "You are 'CarePulse AI' (কেয়ারপাল্স এআই), an empathetic, highly knowledgeable, and polite Hospital Healthcare Assistant for CarePulse Hospital Management System.

Your Responsibilities:
1. Help patients find suitable specialist doctors based on symptoms (Cardiology, Neurology, Pediatrics, Orthopedics, General Medicine, Gynecology, Dermatology, Oncology, ENT).
2. Guide users on how to book an appointment, view visiting hours, check hospital bed availability (ICU, CCU, Cabins), and blood bank services.
3. Answer common hospital procedure questions (admission, billing, OPD hours: 8:00 AM - 10:00 PM, 24/7 Emergency & Pharmacy).
4. Provide sensible health education and triage guidance with an ethical medical disclaimer ('For severe emergencies, please visit the emergency room immediately or call 16263/999').

Language Rules:
- If language is 'bn' (or if user messages in Bengali/Banglish), respond in elegant, friendly, and natural Bengali (বাংলা).
- If language is 'en', respond in clear, caring, professional English.
- Use formatting (bullet points, bold text) for readability.
- Be warm, reassuring, and respectful at all times.";

            $contents = [];

            if (is_array($history)) {
                $recent = array_slice($history, -6);
                foreach ($recent as $turn) {
                    $contents[] = [
                        'role' => ($turn['sender'] ?? 'user') === 'user' ? 'user' : 'model',
                        'parts' => [['text' => $turn['text'] ?? '']],
                    ];
                }
            }

            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $message]],
            ];

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(20)->post($url, [
                'system_instruction' => [
                    'parts' => [['text' => $systemInstruction]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? ($language === 'bn' ? 'আমি আপনাকে সাহায্য করতে পেরে আনন্দিত।' : 'I am here to help you.');

                return response()->json([
                    'reply' => $reply,
                    'suggestedActions' => $suggestedActions,
                ]);
            } else {
                Log::warning('Gemini API Error: ' . $response->body());
                return response()->json([
                    'reply' => $language === 'bn' ? $fallbackBn : $fallbackEn,
                    'suggestedActions' => $suggestedActions,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('AI Chatbot Exception: ' . $e->getMessage());
            return response()->json([
                'reply' => $language === 'bn' ? $fallbackBn : $fallbackEn,
                'suggestedActions' => $suggestedActions,
            ]);
        }
    }

    /**
     * AI Symptom Checker & Clinical Triage
     */
    public function symptomTriage(Request $request)
    {
        $symptoms = $request->input('symptoms');
        $language = $request->input('language', 'en');
        $age = $request->input('age', 'Not specified');
        $gender = $request->input('gender', 'Not specified');
        $duration = $request->input('duration', 'Not specified');
        $severity = $request->input('severity', 'Not specified');
        $existingDiseases = $request->input('existingDiseases', 'None reported');
        $allergies = $request->input('allergies', 'None reported');
        $patientId = $request->input('patientId', 'PAT-1001');

        $apiKey = env('GEMINI_API_KEY');

        $defaultResult = [
            'possibleCategory' => 'General Health Concern',
            'recommendedDepartment' => 'General Medicine',
            'suggestedDoctor' => 'General Physician',
            'urgencyLevel' => 'Normal',
            'guidance' => 'Based on the described symptoms, a consultation with a General Physician is recommended for clinical assessment.',
            'additionalTips' => [
                'Monitor your vitals and resting pulse regularly',
                'Stay adequately hydrated and maintain a bland diet',
                'Take notes of any sudden changes or fever spikes',
                'Bring previous prescriptions to your appointment',
            ],
        ];

        $parsedResult = $defaultResult;

        if ($apiKey && $apiKey !== 'MY_GEMINI_API_KEY') {
            try {
                $prompt = "You are an expert clinical triage AI for a hospital management system. Analyze the following patient symptom report and provide a structured medical department routing recommendation.

Patient Details:
- Symptoms: \"{$symptoms}\"
- Age: {$age}
- Gender: {$gender}
- Duration: {$duration}
- Severity: {$severity}
- Existing Medical Conditions: {$existingDiseases}
- Known Allergies: {$allergies}

Provide a structured JSON response with EXACTLY these fields:
{
  \"possibleCategory\": \"Brief medical category (e.g. Respiratory Infection, Cardiac Event, Neurological Condition)\",
  \"recommendedDepartment\": \"Exact hospital department (e.g. Cardiology, General Medicine, Neurology, ENT, Dermatology, Orthopedics)\",
  \"suggestedDoctor\": \"Doctor specialization title (e.g. General Physician, Cardiologist, Neurologist)\",
  \"urgencyLevel\": \"Emergency | Priority | Normal\",
  \"guidance\": \"2-3 sentences of clinical guidance and immediate self-care advice\",
  \"additionalTips\": [\"tip1\", \"tip2\", \"tip3\", \"tip4\"]
}

Rules:
- urgencyLevel must be 'Emergency' for chest pain, severe breathing difficulty, stroke symptoms
- urgencyLevel must be 'Priority' for high fever >39°C, severe pain, worsening conditions  
- urgencyLevel is 'Normal' for mild-moderate stable conditions
- additionalTips should contain 3-4 practical tips
- Respond ONLY with valid JSON, no markdown codeblocks";

                $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->timeout(20)->post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $prompt]]],
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                        'temperature' => 0.3,
                    ],
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $text = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';
                    $cleanJson = trim(preg_replace('/^```json|```$/m', '', $text));
                    $decoded = json_decode($cleanJson, true);
                    if ($decoded && isset($decoded['possibleCategory'])) {
                        $parsedResult = $decoded;
                    }
                }
            } catch (\Exception $e) {
                Log::error('Symptom triage error: ' . $e->getMessage());
            }
        }

        // Save entry into XAMPP MySQL symptom_checkers table
        try {
            $count = SymptomChecker::count();
            $checkerId = 'CHK-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            SymptomChecker::create([
                'checker_id' => $checkerId,
                'patient_id' => $patientId,
                'symptoms' => $symptoms ?: 'General symptoms check',
                'duration' => $duration,
                'severity' => $severity,
                'existing_diseases' => $existingDiseases !== 'None reported' ? $existingDiseases : null,
                'allergies' => $allergies !== 'None reported' ? $allergies : null,
                'analysis_result' => $parsedResult['possibleCategory'] . ' - ' . $parsedResult['guidance'],
                'recommended_department' => $parsedResult['recommendedDepartment'],
                'urgency_level' => in_array($parsedResult['urgencyLevel'], ['Emergency', 'Priority', 'Normal']) ? $parsedResult['urgencyLevel'] : 'Normal',
                'created_date' => date('Y-m-d'),
            ]);
        } catch (\Exception $e) {
            Log::warning('Could not log symptom check: ' . $e->getMessage());
        }

        return response()->json($parsedResult);
    }
}

