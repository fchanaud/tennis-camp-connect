// Client-side only import - will be dynamically imported

interface AssessmentData {
  answers: {
    date_of_birth?: string;
    playing_duration?: string;
    monthly_frequency?: string;
    competition_experience?: string;
    competition_level?: string;
    confident_aspects?: string;
    improvement_areas?: string;
    current_injuries?: string;
    discomfort_movements?: string;
    fitness_rating?: string;
    motivations?: string[];
    learning_preferences?: string[];
    main_goal?: string;
    additional_info?: string;
  };
  completed_at?: string;
}

interface PlayerInfo {
  first_name: string;
  last_name: string;
  email?: string;
}

interface CampInfo {
  start_date: string;
  end_date: string;
  package: string;
}

export async function generateAssessmentPDF(
  player: PlayerInfo,
  camp: CampInfo,
  assessment: AssessmentData
): Promise<void> {
  // Dynamic import for client-side only
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Pre-Camp Assessment', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Player Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Player: ${player.first_name} ${player.last_name}`, margin, yPos);
  yPos += 7;
  
  if (player.email) {
    doc.text(`Email: ${player.email}`, margin, yPos);
    yPos += 7;
  }

  // Camp Information
  const campStartDate = new Date(camp.start_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const campEndDate = new Date(camp.end_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Camp Period: ${campStartDate} - ${campEndDate}`, margin, yPos);
  yPos += 7;
  doc.text(`Package: ${camp.package.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`, margin, yPos);
  yPos += 7;

  if (assessment.completed_at) {
    const completedDate = new Date(assessment.completed_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Completed: ${completedDate}`, margin, yPos);
    yPos += 10;
  } else {
    yPos += 5;
  }

  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  const answers = assessment.answers || {};

  // Personal Information Section
  if (answers.date_of_birth) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Information', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const dob = new Date(answers.date_of_birth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date of Birth: ${dob}`, margin + 5, yPos);
    yPos += 10;
  }

  // Playing Background Section
  if (answers.playing_duration || answers.monthly_frequency || answers.competition_experience || answers.competition_level) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Playing Background', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (answers.playing_duration) {
      doc.text(`Playing Duration: ${answers.playing_duration}`, margin + 5, yPos);
      yPos += 7;
    }
    if (answers.monthly_frequency) {
      doc.text(`Monthly Frequency: ${answers.monthly_frequency}`, margin + 5, yPos);
      yPos += 7;
    }
    if (answers.competition_experience) {
      doc.text(`Competition Experience: ${answers.competition_experience}`, margin + 5, yPos);
      yPos += 7;
    }
    if (answers.competition_level) {
      doc.text(`Competition Level: ${answers.competition_level}`, margin + 5, yPos);
      yPos += 7;
    }
    yPos += 3;
  }

  // Game Profile Section
  if (answers.confident_aspects || answers.improvement_areas) {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Game Profile', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (answers.confident_aspects) {
      const confidentLines = doc.splitTextToSize(`Confident Aspects: ${answers.confident_aspects}`, pageWidth - 2 * margin - 10);
      doc.text(confidentLines, margin + 5, yPos);
      yPos += confidentLines.length * 6;
    }
    if (answers.improvement_areas) {
      const improvementLines = doc.splitTextToSize(`Areas to Improve: ${answers.improvement_areas}`, pageWidth - 2 * margin - 10);
      doc.text(improvementLines, margin + 5, yPos);
      yPos += improvementLines.length * 6;
    }
    yPos += 3;
  }

  // Physical & Health Section
  if (answers.current_injuries || answers.discomfort_movements || answers.fitness_rating) {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Physical & Health', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (answers.current_injuries) {
      const injuryLines = doc.splitTextToSize(`Current Injuries: ${answers.current_injuries}`, pageWidth - 2 * margin - 10);
      doc.text(injuryLines, margin + 5, yPos);
      yPos += injuryLines.length * 6;
    }
    if (answers.discomfort_movements) {
      const discomfortLines = doc.splitTextToSize(`Discomfort Movements: ${answers.discomfort_movements}`, pageWidth - 2 * margin - 10);
      doc.text(discomfortLines, margin + 5, yPos);
      yPos += discomfortLines.length * 6;
    }
    if (answers.fitness_rating) {
      doc.text(`Fitness Rating: ${answers.fitness_rating}/5`, margin + 5, yPos);
      yPos += 7;
    }
    yPos += 3;
  }

  // Learning & Motivation Section
  if ((answers.motivations && answers.motivations.length > 0) || 
      (answers.learning_preferences && answers.learning_preferences.length > 0)) {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Learning & Motivation', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (answers.motivations && answers.motivations.length > 0) {
      doc.text(`Motivations: ${answers.motivations.join(', ')}`, margin + 5, yPos);
      yPos += 7;
    }
    if (answers.learning_preferences && answers.learning_preferences.length > 0) {
      doc.text(`Learning Preferences: ${answers.learning_preferences.join(', ')}`, margin + 5, yPos);
      yPos += 7;
    }
    yPos += 3;
  }

  // Goals & Expectations Section
  if (answers.main_goal || answers.additional_info) {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Goals & Expectations', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (answers.main_goal) {
      const goalLines = doc.splitTextToSize(`Main Goal: ${answers.main_goal}`, pageWidth - 2 * margin - 10);
      doc.text(goalLines, margin + 5, yPos);
      yPos += goalLines.length * 6;
    }
    if (answers.additional_info) {
      const infoLines = doc.splitTextToSize(`Additional Information: ${answers.additional_info}`, pageWidth - 2 * margin - 10);
      doc.text(infoLines, margin + 5, yPos);
      yPos += infoLines.length * 6;
    }
  }

  // Generate filename
  const filename = `Assessment_${player.first_name}_${player.last_name}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}

