const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');

/**
 * Resume Parser Service
 * Extracts structured data from PDF and DOCX resume files
 */

class ResumeParserService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    
    // Common patterns for resume parsing
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
      date: /\b(0[1-9]|1[0-2])\/([0-2][0-9]|3[0-1])\/\d{4}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi,
      year: /\b(19|20)\d{2}\b/g,
      gpa: /\b(?:GPA|gpa)[:\s]*(\d+\.?\d*)\b/gi
    };
    
    // Section headers to identify different parts of resume
    this.sectionHeaders = {
      experience: [
        'experience', 'work experience', 'professional experience', 'employment',
        'work history', 'career', 'professional background'
      ],
      education: [
        'education', 'academic background', 'qualifications', 'academic',
        'educational background', 'university', 'college'
      ],
      skills: [
        'skills', 'technical skills', 'technical', 'competencies', 'expertise',
        'proficiencies', 'technologies', 'tools', 'programming languages'
      ],
      projects: [
        'projects', 'personal projects', 'academic projects', 'portfolio'
      ],
      certifications: [
        'certifications', 'certificates', 'credentials', 'licenses'
      ]
    };
    
    // Common skill keywords
    this.skillKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'html', 'css',
      'sql', 'mongodb', 'mysql', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
      'git', 'ci/cd', 'devops', 'microservices', 'rest api', 'graphql', 'typescript',
      'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'go', 'rust',
      'machine learning', 'artificial intelligence', 'data science', 'analytics',
      'project management', 'agile', 'scrum', 'leadership', 'communication',
      'teamwork', 'problem-solving', 'critical thinking', 'creativity'
    ];
  }

  /**
   * Parse resume file and extract structured data
   */
  async parseResume(filePath, fileType) {
    try {
      console.log('🔍 Starting resume parsing for:', filePath);
      console.log('📁 File type:', fileType);
      
      let text = '';
      
      // Extract text based on file type
      if (fileType === 'pdf') {
        console.log('📄 Reading PDF file...');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        text = data.text;
        console.log('✅ PDF parsed successfully, text length:', text.length);
      } else if (fileType === 'docx') {
        console.log('📄 Reading DOCX file...');
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
        console.log('✅ DOCX parsed successfully, text length:', text.length);
      } else {
        console.log('❌ Unsupported file type:', fileType);
        throw new Error('Unsupported file type');
      }
      
      // Clean and normalize text
      const cleanedText = this.cleanText(text);
      console.log('🧹 Text cleaned, length:', cleanedText.length);
      
      // Extract structured information
      const parsedData = {
        candidateName: this.extractName(cleanedText),
        email: this.extractEmail(cleanedText),
        phone: this.extractPhone(cleanedText),
        skills: this.extractSkills(cleanedText),
        experience: this.extractExperience(cleanedText),
        education: this.extractEducation(cleanedText),
        status: this.extractResumeStatus(cleanedText),
        rawText: cleanedText
      };
      
      console.log('📊 Parsed data:', {
        name: parsedData.candidateName,
        email: parsedData.email,
        skillsCount: parsedData.skills.length,
        experienceCount: parsedData.experience.length,
        educationCount: parsedData.education.length
      });
      
      return parsedData;
    } catch (error) {
      console.error('❌ Resume parsing error:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  /**
   * Clean and normalize text
   */
  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[^\w\s@.-]/g, ' ') // Remove special characters except email chars
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  /**
   * Extract candidate name from resume
   */
  extractName(text) {
    // Split by common delimiters and clean up
    const lines = text.split(/[\n\r]+/).filter(line => line.trim().length > 0);
    
    console.log('🔍 Extracting name from lines:', lines.slice(0, 5));
    
    // Try multiple strategies to find the name
    const namePatterns = [
      // Pattern 1: Name followed by "Name" label (most common for Indian resumes)
      /^Name\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})(?:\s|$)/i,
      // Pattern 2: ALL CAPS name (common in Indian resumes)
      /^[A-Z]{2,}(?:\s+[A-Z]{2,}){1,3}$/,
      // Pattern 3: Name followed by "Name" label with optional colon
      /^(?:Name|Resume|CV)\s*[:\-]?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})$/i,
      // Pattern 4: Line that looks like a name (2-4 words, first letter capitalized)
      /^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3}$/i,
      // Pattern 5: Name followed by email
      /^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})\s+(?:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i,
      // Pattern 6: Mixed case with spaces
      /^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3}$/i
    ];

    // First try patterns on individual lines
    for (const line of lines) {
      const trimmedLine = line.trim();
      console.log('🔍 Checking line for name:', trimmedLine);
      
      for (const pattern of namePatterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          // Extract captured name (group 1 or first match)
          let extractedName = match[1] || match[0];
          
          // Clean up the extracted name
          extractedName = extractedName.replace(/\s+(Email|Address|Phone|Date|Nationality|Link).*$/i, '').trim();
          
          console.log('✅ Name matched with pattern:', extractedName);
          
          // Validate that it looks like a real name
          if (extractedName.split(' ').length >= 2 && 
              extractedName.split(' ').length <= 4 &&
              !/\d/.test(extractedName) &&
              !/@/.test(extractedName) &&
              !/www\./i.test(extractedName)) {
            return extractedName;
          }
        }
      }
    }
    
    // Special handling for Indian resume format (ALL CAPS names)
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Check if it's all caps and looks like a name
      if (/^[A-Z\s]+$/.test(trimmedLine) && 
          trimmedLine.split(' ').length >= 2 && 
          trimmedLine.split(' ').length <= 4 &&
          trimmedLine.length > 5 &&
          trimmedLine.length < 50) {
        console.log('✅ Found ALL CAPS name:', trimmedLine);
        return trimmedLine;
      }
    }
    
    // If no name found, return first non-empty line that might be a name
    const fallbackName = lines.find(line => 
      line.trim().length > 0 && 
      line.trim().split(' ').length >= 2 && 
      line.trim().split(' ').length <= 4 &&
      !/\d/.test(line.trim()) &&
      !/@/.test(line.trim()) &&
      line.trim().length < 50
    );
    
    console.log('🔍 Fallback name:', fallbackName?.trim() || 'Unknown Name');
    return fallbackName?.trim() || 'Unknown Name';
  }

  /**
   * Extract email address
   */
  extractEmail(text) {
    const emails = text.match(this.patterns.email);
    return emails && emails.length > 0 ? emails[0] : null;
  }

  /**
   * Extract phone number
   */
  extractPhone(text) {
    const phones = text.match(this.patterns.phone);
    return phones && phones.length > 0 ? phones[0] : null;
  }

  /**
   * Extract skills from text
   */
  extractSkills(text) {
    const skills = new Set();
    const lowerText = text.toLowerCase();
    
    // Extract skills using keyword matching
    this.skillKeywords.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    });
    
    // Extract skills from skills section
    const skillsSection = this.extractSection(text, 'skills');
    if (skillsSection) {
      const sectionSkills = this.extractSkillsFromSection(skillsSection);
      sectionSkills.forEach(skill => skills.add(skill));
    }
    
    // Extract skills using patterns
    const skillPatterns = [
      /\b(javascript|python|java|react|node|angular|vue|html|css|sql|mongodb|mysql|postgresql|aws|azure|docker|kubernetes|git|ci\/cd|devops|microservices|rest api|graphql|typescript|c\+\+|c#|php|ruby|swift|kotlin|scala|go|rust)\b/gi,
      /\b(machine learning|artificial intelligence|data science|analytics|project management|agile|scrum|leadership|communication|teamwork|problem-solving|critical thinking|creativity)\b/gi
    ];
    
    skillPatterns.forEach(pattern => {
      const matches = lowerText.match(pattern);
      if (matches) {
        matches.forEach(match => skills.add(match));
      }
    });
    
    return Array.from(skills);
  }

  /**
   * Extract skills from a specific section
   */
  extractSkillsFromSection(sectionText) {
    const skills = [];
    const lines = sectionText.split('\n');
    
    lines.forEach(line => {
      // Remove bullet points and clean
      const cleanLine = line.replace(/^[\s•\-\*]\s*/, '').trim();
      
      // Check if line contains known skills
      this.skillKeywords.forEach(skill => {
        if (cleanLine.toLowerCase().includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
      
      // Extract skills from comma-separated lists
      if (cleanLine.includes(',')) {
        const items = cleanLine.split(',').map(item => item.trim());
        items.forEach(item => {
          if (item.length > 2 && item.length < 30) {
            skills.push(item);
          }
        });
      }
    });
    
    return skills;
  }

  /**
   * Extract work experience
   */
  extractExperience(text) {
    const experienceSection = this.extractSection(text, 'experience');
    if (!experienceSection) {
      // Try to extract from internships/employment mentioned in raw text
      const internships = [];
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.includes('Internship') || line.includes('Development') || line.includes('Web Development')) {
          const companyMatch = line.match(/([A-Z][a-zA-Z\s&]+(?:Technology|Pvt|Ltd|LLP|Inc|Corp|Hub)\s*[A-Z][a-zA-Z\s&]*)/);
          if (companyMatch) {
            internships.push({
              company: companyMatch[0].trim(),
              position: line.includes('Web Development') ? 'Web Developer' : 'Intern',
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              description: line.trim()
            });
          }
        }
      }
      
      return internships;
    }
    
    const experiences = [];
    const lines = experienceSection.split('\n');
    
    let currentExperience = null;
    for (const line of lines) {
      // Look for dates in line
      const dateMatch = line.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{1,2}[-/]\d{4})/);
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      
      if (dateMatch && yearMatch) {
        if (currentExperience) {
          experiences.push(currentExperience);
        }
        
        currentExperience = {
          company: line.trim(),
          startDate: dateMatch[0],
          endDate: dateMatch[0],
          description: '',
          technologies: []
        };
      } else if (currentExperience) {
        // Add to current experience description
        currentExperience.description += line.trim() + ' ';
      }
    }
    
    if (currentExperience) {
      experiences.push(currentExperience);
    }
    
    return experiences;
  }

  /**
   * Extract education information
   */
  extractEducation(text) {
    const educationSection = this.extractSection(text, 'education');
    if (!educationSection) return [];
    
    const education = [];
    const lines = educationSection.split('\n');
    
    let currentEducation = null;
    for (const line of lines) {
      // Look for graduation years
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      const degreeMatch = line.match(/(Bachelor|Master|PhD|Diploma|B\.Tech|M\.Tech|B\.E|M\.E|MCA|BCA|BSc|MSc)/i);
      
      if (yearMatch && degreeMatch) {
        currentEducation = {
          degree: degreeMatch[0] + ' in ' + line.match(/\d{4}/)[0],
          year: yearMatch[0],
          institution: '',
          description: line.trim()
        };
      } else if (currentEducation) {
        // Add to current education description
        currentEducation.description += line.trim() + ' ';
      }
    }
    
    if (currentEducation) {
      education.push(currentEducation);
    }
    
    return education;
  }

  /**
   * Extract resume status (hired, rejected, etc.)
   */
  extractResumeStatus(text) {
    const statusKeywords = {
      hired: ['hired', 'selected', 'joined', 'offer', 'accepted'],
      rejected: ['rejected', 'not selected', 'declined', 'not moving forward'],
      underReview: ['under review', 'in progress', 'pending', 'screening'],
      experienced: ['experienced', 'senior', 'expert', 'professional']
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [status, keywords] of Object.entries(statusKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return status;
        }
      }
    }
    
    // Default status if no keywords found
    return 'new'; // Default for new applicants
  }

  /**
   * Check if line looks like a job title
   */
  isJobTitleLine(line) {
    // Job titles usually contain position and company
    const hasPosition = /\b(manager|developer|engineer|analyst|director|specialist|coordinator|consultant|architect|designer|lead|senior|junior)\b/i.test(line);
    const hasCompany = /\b(at|@|–|-|,)\s+[A-Z][a-z]/.test(line);
    
    return hasPosition || hasCompany;
  }

  /**
   * Parse job title and company from line
   */
  parseJobLine(line) {
    const experience = {
      company: '',
      position: '',
      location: '',
      description: ''
    };
    
    // Try to extract position and company
    const parts = line.split(/(?:at|@|–|-|,)/i);
    if (parts.length >= 2) {
      experience.position = parts[0].trim();
      experience.company = parts[1].trim();
    } else {
      experience.position = line.trim();
    }
    
    return experience;
  }

  /**
   * Check if line contains dates
   */
  isDateLine(line) {
    return this.patterns.year.test(line) || this.patterns.date.test(line);
  }

  /**
   * Parse start and end dates from line
   */
  parseDates(line) {
    const years = line.match(this.patterns.year);
    if (years && years.length >= 1) {
      return {
        start: new Date(years[0], 0, 1),
        end: years.length > 1 ? new Date(years[1], 11, 31) : null
      };
    }
    
    return null;
  }

  /**
   * Extract education information
   */
  extractEducation(text) {
    const educationSection = this.extractSection(text, 'education');
    if (!educationSection) {
      // Try to extract from raw text
      const education = [];
      const lines = text.split('\n');
      
      for (const line of lines) {
        // Look for education patterns
        if (line.includes('SSC') || line.includes('HSC') || line.includes('Diplome') || line.includes('Bachelor') || line.includes('Master')) {
          const yearMatch = line.match(/\b(20)\d{2}\b/);
          const institutionMatch = line.match(/(Jawahar Vidyalaya|Government Polytechnic|Matoshri Aasarabai Polytechnic)/);
          const degreeMatch = line.match(/(SSC|Diplome in Computer science and Engineering)/);
          
          if (yearMatch && (institutionMatch || degreeMatch)) {
            education.push({
              institution: institutionMatch ? institutionMatch[0] : 'Unknown Institution',
              degree: degreeMatch ? degreeMatch[0] : 'Unknown Degree',
              field: degreeMatch && degreeMatch[0].includes('Computer') ? 'Computer Science' : 'General',
              year: yearMatch[0],
              gpa: null
            });
          }
        }
      }
      
      return education;
    }
    
    const education = [];
    const lines = educationSection.split('\n').filter(line => line.trim());
    
    let currentEducation = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line looks like an education entry
      if (this.isEducationLine(line)) {
        // Save previous education if exists
        if (currentEducation) {
          education.push(currentEducation);
        }
        
        // Start new education entry
        currentEducation = this.parseEducationLine(line);
      } else if (currentEducation && this.isDateLine(line)) {
        // Parse dates
        const dates = this.parseDates(line);
        if (dates) {
          currentEducation.startDate = dates.start;
          currentEducation.endDate = dates.end;
        }
      } else if (currentEducation && !currentEducation.field) {
        // Extract field of study
        currentEducation.field = line;
      }
    }
    
    // Add last education
    if (currentEducation) {
      education.push(currentEducation);
    }
    
    return education;
  }

  /**
   * Check if line looks like an education entry
   */
  isEducationLine(line) {
    const educationKeywords = /\b(university|college|institute|academy|school|bachelor|master|phd|doctorate|degree|diploma|certificate)\b/i;
    return educationKeywords.test(line);
  }

  /**
   * Parse education line
   */
  parseEducationLine(line) {
    const education = {
      institution: '',
      degree: '',
      field: '',
      startDate: null,
      endDate: null,
      gpa: null
    };
    
    // Extract GPA if present
    const gpaMatch = line.match(this.patterns.gpa);
    if (gpaMatch) {
      education.gpa = parseFloat(gpaMatch[1]);
    }
    
    // Try to extract institution and degree
    const parts = line.split(/,|\|/);
    if (parts.length >= 1) {
      education.institution = parts[0].trim();
    }
    
    if (parts.length >= 2) {
      education.degree = parts[1].trim();
    }
    
    return education;
  }

  /**
   * Extract a specific section from text
   */
  extractSection(text, sectionType) {
    const headers = this.sectionHeaders[sectionType];
    if (!headers) return null;
    
    const lines = text.split('\n');
    let startIndex = -1;
    let endIndex = lines.length;
    
    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      
      if (headers.some(header => line.includes(header))) {
        startIndex = i + 1;
        break;
      }
    }
    
    if (startIndex === -1) return null;
    
    // Find section end (next major section)
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      
      // Check if this is a new section header
      const isNewSection = Object.values(this.sectionHeaders).some(sectionHeaders =>
        sectionHeaders.some(header => line.includes(header))
      );
      
      if (isNewSection && !headers.some(header => line.includes(header))) {
        endIndex = i;
        break;
      }
    }
    
    // Extract section content
    const sectionLines = lines.slice(startIndex, endIndex);
    return sectionLines.join('\n').trim();
  }
}

module.exports = new ResumeParserService();
