import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class CurrencyExchangeRate {
  @Prop({ required: true, type: Number, min: 0 })
  purchase_price: number;

  @Prop({ required: true, type: Number, min: 0 })
  sale_price: number;
}

@Schema()
export class Transaction extends Document<string> {
  @Prop({ required: true, enum: ['compra', 'venta'] })
  tipo_de_cambio: string;

  @Prop({ required: true, type: CurrencyExchangeRate })
  tasa_de_cambio: CurrencyExchangeRate;

  @Prop({ required: true, type: Number, min: 0 })
  monto_enviar: number;

  @Prop({ required: true, type: Number, min: 0 })
  monto_recibir: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  id_usuario: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
