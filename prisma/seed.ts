import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.note.deleteMany()

  await prisma.note.createMany({
    data: [
      {
        title: 'Getting Started with NoteBox',
        content:
          'Welcome to NoteBox! This is your personal space for capturing ideas, thoughts, and anything worth remembering. Create notes quickly and find them easily whenever you need them.',
      },
      {
        title: 'Weekly Goals',
        content:
          '1. Finish the project proposal\n2. Review pull requests from the team\n3. Set up the new development environment\n4. Read two chapters of the book\n5. Exercise at least 3 times',
      },
      {
        title: 'Recipe: Dark Chocolate Brownies',
        content:
          'Ingredients: 200g dark chocolate, 150g butter, 3 eggs, 200g sugar, 100g flour, pinch of salt.\n\nMelt chocolate and butter together. Mix in eggs and sugar. Fold in flour and salt. Bake at 180°C for 25 minutes.',
      },
      {
        title: 'Book Notes — Deep Work by Cal Newport',
        content:
          'Key idea: Ability to focus without distraction on cognitively demanding tasks is becoming increasingly valuable. Schedule deep work blocks. Embrace boredom. Quit social media. Drain the shallows.',
      },
      {
        title: 'Project Ideas',
        content:
          '- CLI tool for generating TypeScript interfaces from JSON\n- Chrome extension for reading time estimation\n- Open-source Pomodoro timer with stats dashboard\n- Minimal Markdown blog generator using Astro',
      },
    ],
  })

  console.log('Seed complete: 5 notes inserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
