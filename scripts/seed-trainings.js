const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding training data...');

  // Delete all existing trainings
  await prisma.training.deleteMany({});
  console.log('🗑️  Deleted all existing trainings');

  // First, find the content admin or admin user to assign as instructor
  const instructor = await prisma.user.findFirst({
    where: {
      OR: [{ role: 'contentAdmin' }, { role: 'admin' }],
    },
  });

  if (!instructor) {
    console.log(
      '❌ No content admin or admin found. Please run setup-admin.js first.'
    );
    return;
  }

  console.log(`✅ Found instructor: ${instructor.email} (${instructor.role})`);

  // Helper function to create dates
  const createDate = (dateString, hour = 10, minute = 0) => {
    const [day, month, year] = dateString.split(/[-\s]/);
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  // The 3 specific trainings as provided
  const trainings = [
    {
      title: 'Performance optimization & Dynamic Media overview in AEM',
      description:
        'Comprehensive overview of performance optimization techniques and dynamic media handling in Adobe Experience Manager (AEM). Learn best practices for improving site performance and managing media assets effectively.',
      category: 'BE',
      conductedBy: 'Yogesh Kumar',
      dateTime: createDate('11-06-2025', 10, 0), // 11 Jun 2025, 10:00 AM
      meetingLink: 'https://meet.google.com/performance-aem-training',
      videoUrl:
        'https://drive.google.com/drive/folders/129nAuMyLkkj2rsFwJS43XyUJR3_3wnSO',
      pptUrl:
        'https://docs.google.com/presentation/d/1wooE77A46cLmodqQUXMAfnlUwhYfBpG6_H3g83nptkE/edit?usp=sharing',
      summary:
        'Covered AEM performance optimization techniques, dynamic media configuration, and best practices for managing large-scale media assets in enterprise environments.',
      instructorId: instructor.id,
    },
    {
      title: 'Stepping into the world of BA',
      description:
        'A comprehensive introduction to Business Analysis covering the transition from QA to BA, role in SDLC, key skills, and challenges of remote work. Essential for anyone looking to understand or transition into Business Analysis.',
      category: 'General',
      conductedBy: 'Mavish',
      dateTime: createDate('22-01-2025', 14, 0), // 22 Jan 2025, 2:00 PM
      meetingLink: 'https://meet.google.com/ba-introduction-training',
      videoUrl:
        'https://drive.google.com/drive/folders/1eq7FbLQ4kg_Ao-ujaDWPXmAng9930NFt',
      pptUrl: null,
      summary:
        'Intro - Setting the stage, My perceived role of a BA, The reality, Role of BA in SDLC, My transition from a QA to BA, Key steps, Challenges of being a remote BA, Skills to thrive',
      instructorId: instructor.id,
    },
    {
      title: 'Principles of UX Design',
      description:
        'Fundamental principles of User Experience Design covering design thinking, user-centered design processes, usability principles, and practical application of UX methodologies in real-world projects.',
      category: 'General',
      conductedBy: 'Amanpreet Singh Bhullar',
      dateTime: createDate('17-06-2025', 11, 0), // 17 Jun 2025, 11:00 AM
      meetingLink: 'https://meet.google.com/ux-design-principles',
      videoUrl:
        'https://drive.google.com/drive/folders/1D3Fb457hBJRpBzZscgnuY6RNOa-qpITv',
      pptUrl:
        'https://docs.google.com/presentation/d/1gO_RHwJsg4fvkB6Gk1FGabebqt9wvEZm/edit?usp=sharing&ouid=105272081799982657540&rtpof=true&sd=true',
      summary:
        'Covered fundamental UX design principles, user research methodologies, design thinking process, and practical application of UX principles in digital product development.',
      instructorId: instructor.id,
    },
  ];

  // Create trainings
  for (const training of trainings) {
    try {
      await prisma.training.create({
        data: training,
      });
      console.log(`✅ Created training: ${training.title}`);
    } catch (error) {
      console.log(
        `❌ Failed to create training: ${training.title}`,
        error.message
      );
    }
  }

  console.log('🎉 Training data seeding completed!');
  console.log(`📊 Total trainings created: ${trainings.length}`);
  console.log(
    `📅 Upcoming trainings: ${trainings.filter(t => new Date(t.dateTime) > new Date()).length}`
  );
  console.log(
    `📋 Past trainings: ${trainings.filter(t => new Date(t.dateTime) < new Date()).length}`
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
