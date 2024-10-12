import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderIdentity } from 'src/utils/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true, enum: Object.values(GenderIdentity) })
  gender: GenderIdentity;

  @Prop({ required: true, default: 'http://profile.image.com' })
  profilePic: string;

  @Prop({ required: true, default: 'http://profile.image.com' })
  profileBannerPic: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({
    default: false,
    required: [true, 'You must accept the Terms and Conditions'],
  })
  acceptTerms: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
