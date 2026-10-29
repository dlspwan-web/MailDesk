export type Section = 'dashboard' | 'campaigns' | 'composer' | 'contacts' | 'reports' | 'settings'

export type EmailBlockType = 'heading' | 'text' | 'image' | 'button' | 'link' | 'divider' | 'spacer' | 'footer'

export interface EmailBlock {
  id: string
  type: EmailBlockType
  content?: string
  url?: string
  alt?: string
  color?: string
  textColor?: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'small' | 'medium' | 'large'
  radius?: 'rounded' | 'soft' | 'square'
  isLocal?: boolean
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
}

export interface MailForm {
  campaignName: string
  senderName: string
  senderEmail: string
  subject: string
  previewText: string
}
