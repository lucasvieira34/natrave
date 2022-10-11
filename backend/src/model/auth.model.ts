export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  setId(id: string): User {
    this.id = id;
    return this;
  }

  setName(name: string): User {
    this.name = name;
    return this;
  }

  setUsername(username: string): User {
    this.username = username;
    return this;
  }

  setEmail(email: string): User {
    this.email = email;
    return this;
  }

  setCreatedAt(createdAt: Date): User {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): User {
    this.updatedAt = updatedAt;
    return this;
  }
}

export class AuthModel {
  user: User;
  accessToken: string;

  setUser(user: User): AuthModel {
    this.user = user;
    return this;
  }

  setAccessToken(accessToken: string): AuthModel {
    this.accessToken = accessToken;
    return this;
  }
}
