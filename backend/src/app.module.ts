import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { PlacesModule } from './places/places.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    AuthModule,
    SessionsModule,
    PlacesModule,
    ConversationsModule,
    MessagesModule,
    BookingsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
