import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  public currUserObs: Observable<any>;

  constructor(
    public afs: AngularFirestore,
    public storage: AngularFireStorage
  ) {}

  createOrUpdateUser(user: any) {
    // this.afs.collection(collection).add(obj);
    this.afs.collection('users').doc(user.uid).set(user);
  }

  getUserByUidObs(uid: string) {
    return this.afs.collection('users').doc(uid).valueChanges();
  }

  getUsersByGroupCode(groupCode: string) {
    return this.afs
      .collection('users', (ref) => ref.where('groupCode', '==', groupCode))
      .valueChanges();
  }
  getUsers() {
    return this.afs.collection('users').valueChanges();
  }

  async getUserByUid(uid: string) {
    const user = await this.afs
      .collection('users')
      .doc(uid)
      .valueChanges()
      .pipe(first())
      .toPromise();

    return user;
  }

  async uploadFile(name: string, file: any) {
    return this.storage.upload(`files/${name}`, file);
  }
  // async getUserByUid(uid: string) {
  //   const users = await this.afs
  //     .collection('users', (ref) => ref.where('uid', '==', uid).limit(1))
  //     .valueChanges()
  //     .pipe(first())
  //     .toPromise();
  //   if (users) {
  //     return users[0];
  //   } else {
  //     return null;
  //   }
  // }
}
