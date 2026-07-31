
import React, { useState, useEffect } from 'react';
import QuestionForm, { Question } from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions from Supabase when the component mounts
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Map the Supabase data to our Question interface
        const formattedQuestions = data.map((item) => ({
          id: item.id,
          name: item.name,
          question: item.question,
          timestamp: new Date(item.created_at || Date.now()),
        }));
        
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    // Set up a realtime subscription for new questions
    const subscription = supabase
      .channel('public:questions')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'questions' 
      }, (payload) => {
        const newQuestion = {
          id: payload.new.id,
          name: payload.new.name,
          question: payload.new.question,
          timestamp: new Date(payload.new.created_at || Date.now()),
        };
        setQuestions((prev) => [newQuestion, ...prev]);
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSubmitQuestion = (questionData: Omit<Question, 'id' | 'timestamp'>) => {
    // The form component now handles the Supabase submission
    // This is just for updating the local state
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9), // This will be overwritten when the realtime subscription receives the actual DB entry
      name: questionData.name,
      question: questionData.question,
      timestamp: new Date(),
    };
    
    setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-[#8B5CF6] animate-pulse tracking-tight">
            HIMSS "संवाद" PLATFORM
          </h1>
            
             <h2 className="mt-6 text-lg leading-8 text-left max-w-4xl mx-auto">
  <p className="font-semibold text-purple-700">
    सन्मानीय होमीओपॅथ्स,
  </p>

  <p className="font-bold text-red-600">
    सस्नेह नमस्कार 🙏
  </p>

  <br />

  <p>
    आपल्या homoeopaths ना प्रॅक्टिसमध्ये आजकाल खूप अडचणीचा सामना करावा लागत आहे.
    Social media मधून मिळणारी उलट सुलट माहिती, वेगवेगळ्या what's up ग्रुप मधून आलेले
    मेसेज, आपले classmates, collogues यातून नेमकं काय बरोबर काय चूक कळेनासे होतं.
    त्यात विविध आंदोलने, कोर्ट केसेस अजून संभ्रम तयार करतात.
  </p>

  <p>आपण RMP आहोत की नाही?</p>
  <p>CCMP केल्यावर allopathic practice allowed आहे का?</p>
  <p>का MMC रेजिस्ट्रेशन गरजेचे आहे?</p>
  <p>Pure homoeopathy करणाऱ्याला pollution control certificate गरजेचे आहे की नाही?</p>
  <p>Homoeopath म्हणून मी एखाद्या पेशंटचे death certificate देऊ शकतो का?</p>
  <p>Fitness certificate कुणाला देऊ शकतो?</p>
  <p>नवीन clinical establishment act मध्ये homoeopath काय नियम आहेत?</p>
  <p>मी फक्त homoeopathy practice करतो तरी मला दरफलक लावणं गरजेचे आहे का?</p>
  <p>सध्या जी आंदोलने सुरु आहेत, कोर्टात केसेस सुरु आहेत त्यातून काय हाती लागेल?</p>

  <p>
    अनेक प्रश्न डोक्यात येतात पण नेमके
    <span className="text-red-600 font-semibold"> उत्तर सापडत नाही....</span>
  </p>

  <br />

  <p>
    याचसाठी HIMSS Sindhudurg आपल्या सर्व प्रश्नांची उत्तरे त्या त्या विषयावर अभ्यासु
    तज्ञ मंडळी कडून ऐकायची संधी येत्या <strong>9 ऑगस्ट 2026</strong> रोजी सायंकाळी
    ठीक <strong>4 वाजता</strong> माई इन्स्टिटयूट ऑफ हॉटेल मॅनेजमेंट,
    रेल्वे स्टेशन रोड, मळगाव - सावंतवाडी येथे उपलब्ध करत आहे.
  </p>

  <p>
    तत्पूर्वी आपल्याला फक्त एकच काम करायचं आहे...
  </p>

  <p>
    आपल्या मनातले homoeopathy संदर्भातील जे जे प्रश्न आहेत ते खाली दिलेल्या लिंक वर
    पाठवा. जेणेकरून आपले प्रश्नाची उत्तरे आपल्याला मिळतील.
  </p>

  <p>
    आपले प्रश्न या लिंक वर दिनांक <strong>5 ऑगस्टच्या सांयकाळी 7 वाजेपर्यंत</strong>
    पाठवा. त्यानंतर लिंक बंद होईल.
  </p>

  <p>
    कृपया एक लक्षात घ्या, या कार्यक्रमात प्रत्यक्ष प्रश्न विचारता येणार नाही. कारण
    प्रश्न अनेक आहेत आणि एखादी व्यक्ती जास्त संधी घेईल आणि एखाद्याला काहीच विचारता
    येणार नाही. म्हणूनच आपले प्रश्न लिंकवरच पाठवा.
  </p>

  <br />

  <p className="font-bold text-green-600">
    ही नम्र विंनती
  </p>

  <br />

  <p className="font-bold text-purple-700">
    HIMSS सिंधुदुर्ग.
  </p>
</h2> 

        </div>
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm font-medium text-primary mb-2 inline-block px-3 py-1 rounded-full bg-primary/10">Community Questions</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Ask Anything </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Submit your questions and see what others are asking. 
            Your contribution helps build our knowledge base.
          </p>
        </div>
        
        <QuestionForm onSubmit={handleSubmitQuestion} />
        <QuestionList questions={questions} isLoading={loading} />
      </div>
    </div>
  );
};

export default Index;
