// Foydalanuvchi roli (do'kon egasi va xodimlar uchun)
export enum RoleUser {
  OWNER = 'OWNER',
  STAFF = 'STAFF',
}

// Hamkor roli (mijoz va mahsulot yetkazuvchilar uchun)
export enum RolePartner {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
}

// Mahsulot o‘lchov birliklari
export enum Units {
  KG = 'KG',
  DONA = 'DONA',
  LITR = 'LITR',
  M2 = 'M2',
}

// Holat (masalan: order yoki qaytarish statusi)
export enum State {
  DONE = 'DONE',
  CANCELED = 'CANCELED',
}

// Shartnoma (order) statuslari
export enum ContractStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  RETURNED = 'RETURNED',
}

// To‘lov usullari
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
}

// To‘lov yo‘nalishi
export enum PaymentType {
  IN = 'IN',
  OUT = 'OUT',
}
