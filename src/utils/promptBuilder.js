const categoryLabels = {
  product: 'product',
  person: 'person',
  environment: 'environment',
  other: 'subject',
}

const typeLabels = {
  edit: 'Edit the image.',
  enhance: 'Improve the image quality.',
  restyle: 'Change the visual style of the image.',
  background: 'Change the background of the image.',
}

const styleLabels = {
  realistic: 'realistic',
  professional: 'professional',
  cinematic: 'cinematic',
  artistic: 'artistic',
}

const lightingLabels = {
  natural: 'natural lighting',
  studio: 'studio lighting',
  soft: 'soft lighting',
  dramatic: 'dramatic lighting',
}

const editStrengthLabels = {
  subtle:
    'Make subtle changes while preserving the original image as much as possible.',

  moderate:
    'Apply a moderate level of transformation while preserving important details.',

  significant:
    'Apply significant changes while preserving the main subject and important details.',
}

const NO_TEXT_INSTRUCTION = `
Do not add any text, letters, words, numbers, captions,
typography, logos, watermarks, labels, signs, or written
elements anywhere in the image.

The final image must contain absolutely no newly generated text.
`

export function buildPrompt({
  category,
  type,
  style,
  lighting,
  editStrength,
  description,
}) {
  const categoryInstruction =
    categoryLabels[category] || 'subject'

  const typeInstruction =
    typeLabels[type] || 'Edit the image.'

  const styleInstruction =
    styleLabels[style] || 'realistic'

  const lightingInstruction =
    lightingLabels[lighting] || 'natural lighting'

  const strengthInstruction =
    editStrengthLabels[editStrength] ||
    editStrengthLabels.moderate

  const additionalInstructions =
    description?.trim() ||
    'No additional instructions were provided.'

  return `
Edit the provided image.

CRITICAL:
${NO_TEXT_INSTRUCTION}

Image category:
${categoryInstruction}

Main editing request:
${typeInstruction}

Visual style:
Apply a ${styleInstruction} visual style.

Lighting:
Use ${lightingInstruction}.

Editing intensity:
${strengthInstruction}

Additional instructions:
${additionalInstructions}

Preserve the main subject, identity, proportions,
composition, and important natural details unless
the user explicitly requests otherwise.

Keep the result realistic, clean, professional,
and visually consistent with the original image.

${NO_TEXT_INSTRUCTION}
`.trim()
}