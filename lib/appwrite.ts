import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
  Storage,
  TablesDB
} from "react-native-appwrite";

export interface UserLocationData{

}
  
  // Environment variables will be checked when actually used
  // This allows the app to start even if env vars are not set
  
  export const config ={
    platform: "com.tennisapp.app",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id',
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || 'your-database-id',
    playerCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PLAYER_COLLECTION_ID || 'your-player-collection-id',
    memberCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MEMBER_COLLECTION_ID || 'your-member-collection-id',
    matchCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MATCH_COLLECTION_ID || 'your-match-collection-id',
    leagueCollectionId: process.env.EXPO_PUBLIC_APPWRITE_LEAGUE_COLLECTION_ID || 'your-league-collection-id',
    globalLeagueId: process.env.EXPO_PUBLIC_APPWRITE_GLOBAL_LEAGUE_ID || 'your-global-league-id',
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID || 'your-storage-id'
  };
  
  // Validation function to check if environment variables are properly set
  const validateAppwriteConfig = () => {
    if (!process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || !process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) {
      throw new Error('Missing required Appwrite configuration. Please set up your environment variables in .env file.');
    }
  };

  export const client = new Client();
  client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
  
  export const avatar = new Avatars(client);
  export const account = new Account(client);
  export const databases = new Databases(client);
  export const tablesdb = new TablesDB(client);
  export const storage = new Storage(client);

 /* export async function registerUser(email: string, password: string, name: string, leagueCode: string, phoneNumber: string, city: string, county: string, state: string, country: string, deviceType: string) {
    try{
      validateAppwriteConfig();

      const lgresult = await tablesdb.listRows({
        databaseId: config.databaseId!, 
        tableId: config.leagueCollectionId!,
        queries: [Query.equal('LadderCode', leagueCode)]
      }
      );

      if(lgresult.rows.length == 0){
        console.log("no league found")
        return null;
      }

      const account = new Account(client);

      console.log('verifying')
      verifyEmail(email);

      const uniqueId = ID.unique();

      console.log('creating account');
      const promise2 =  account.create(uniqueId, email, password);
      
      //const promise2 = await account.createVerification('https://example.com/verify');

      //Create the player document
      const result = await tablesdb.upsertRow({
        databaseId: config.databaseId!,
        tableId: config.playerCollectionId!,
        rowId: uniqueId,
        data: {
          name: name,
          email: email,
          PhoneNumber: phoneNumber,
          City: city,
          County: county,
          State: state,
          Country: country,
          DeviceType: deviceType,
        }
    });
      const playerId = result.$id

      //Create the member document
      const result2 = await databases.createDocument(
        config.databaseId!,
        config.memberCollectionId!,
        ID.unique(),
        {
          player: uniqueId,
          league: lgresult.rows[0].$id,
          rank: 0,
          rating_value: 1400,
        }
      );
      return playerId;
    }
    catch(error){
      console.log(error);
    }
  }*/

    export async function createUserInDB(Name: string, email: string, city: string, county: string, state: string, country: string, deviceType: string)
    {
       try{
          //Create the player document
        const result = await tablesdb.upsertRow({
          databaseId: config.databaseId!,
          tableId: config.playerCollectionId!,
          rowId: ID.unique(),
          data: {
            name: Name,
            email: email,
            City: city,
            County: county,
            State: state,
            Country: country,
            DeviceType: deviceType,
          }
        });
        const playerId = result.$id

        return playerId
       }
       catch(error) {
        console.log("Error in appwrite.createUserInDB " + error)

       }

    }

  export async function registerUser(email: string, password: string, Name: string, city: string, county: string, state: string, country: string, deviceType: string) {
    try{
      validateAppwriteConfig();

      const account = new Account(client);

      console.log('verifying')
      verifyEmail(email);

      console.log('creating account');

      const promise2 = account.create({userId:  ID.unique(), email: email, password: password});
      
      //const promise2 = await account.createVerification('https://example.com/verify');

      if((await promise2).$id){
        createUserInDB(Name,email,city,county,state,country,deviceType)
      }

      
      //Create the player document
      const playerId = createUserInDB(Name, email, city, county, state, country, deviceType)
      return playerId

    }
    catch(error){
      console.log("Error in registerUser " + error);
    }
  }

  export async function verifyEmail(email: string) {

    const promise = account.createVerification({url: 'https://rallyrankemailpwverify.appwrite.network/verify'});

    promise.then(function (response) {
      console.log(response); // Success
    }, function (error) {
      console.log(error); // Failure
    });
  }

  export async function markEmailVerified(userId: string, secret: string) {
    const promise = account.updateVerification(userId, secret);
  }

  export const checkActiveSession = async () => {
    try {
      const session = await account.getSession({sessionId: 'current'}); // Get the current session
      return session !== null; // Return true if there is an active session
    } catch (error: any) {
      // If there's an error (e.g., no active session), handle it appropriately
      if (error.code === 401) {
        return false; // No active session
      }
      throw error; // Re-throw other unexpected errors
    }
  };

  // Function to delete all sessions for the current user

export const deleteSessions = async () => {
  try {
    // Get the list of all sessions
    const sessions = await account.listSessions();

    // Delete each session
    await Promise.all(
      sessions.sessions.map(async (session) => {
        await account.deleteSession(session.$id);
      })
    );

    console.log('All sessions deleted successfully');
  } catch (error: any) {
    console.error('Error deleting sessions:', error.message);
    throw error; // Re-throw the error for further handling
  }
};

  export async function loginwithEmail(email: string, password: string) {
    try {
      console.log('=== Login Debug ===');
      console.log('Attempting login with email:', email);
      console.log('Password length:', password.length);
      console.log('Appwrite client config:', {
        endpoint: client.config.endpoint,
        project: client.config.project,
      });

      const session = await checkActiveSession();

      if(session){
        await deleteSessions();
      }
  
      const result = await account.createEmailPasswordSession(email, password);
      console.log('Login successful:', result);
      
      // Navigate or update state
      
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
      });
      
      // Show user-friendly error
      Alert.alert(
        'Login Error', 
        `${error.message}\n\nCode: ${error.code}`,
        [{ text: 'OK' }]
      );
    }
  }

  export async function getLadderIDforLadderCode(ladderCode: string) {
    const result = await tablesdb.listRows({databaseId: config.databaseId!, tableId: config.leagueCollectionId!, queries: [Query.equal('LadderCode', ladderCode)]});
    if(result.rows.length > 0)
      return result.rows[0].$id;
    else
      return '';
  }

   export async function addUsertoLadder(UserId: string, ladderId: string) {
    try {
      console.log('Calling Appwrite AddUsertoLadder')
      
      const result = await databases.createDocument(
        config.databaseId!,
        config.memberCollectionId!, 
        ID.unique(),
        {
          league: ladderId,
          player: UserId,
          rank: 0,
          rating_value: 1400,
        }
      );
      
      console.log("Appwrite response for addUsertoLadder, result");
      return result;
    }
    catch (error) {
      console.error('Error addUsertoLadder: ', error);
      return null;
    }
  }

  export async function doesEmailExist(email: string) {
    const result = await tablesdb.listRows({databaseId: config.databaseId!, tableId: config.playerCollectionId!, queries: [Query.equal('email', email)]});
    console.log(result)
    return result.rows.length > 0;
  }
  
  export async function loginwithOauth(provider: string, city: string, county: string, state: string, country: string, deviceType: string) {

      try{

          const pr = provider === "Apple" ? OAuthProvider.Apple : OAuthProvider.Google;

          const session = await checkActiveSession();

          if(session){
            await deleteSessions();
          }

          // Use native scheme for standalone builds, localhost for development
          const redirectUri = makeRedirectUri({
            scheme: 'appwrite-callback-67df0861002d50a5d086',
            preferLocalhost: __DEV__,
          });
          const deepLink = new URL(redirectUri);
          const scheme = `${deepLink.protocol}//`;
          console.log("deepLink = " + deepLink)
          console.log("scheme = " + scheme)

        console.log("provider = " + pr)

        const loginUrl = account.createOAuth2Token({
            provider: pr,
            success: `${deepLink}/(drawer)/(tabs)/`,
            failure: `${deepLink}`,
            scopes: ['name', 'email']
        }  )

      console.log("loginUrl = " + loginUrl)

      console.log("Opening auth session with URL:", loginUrl);
      console.log("Using scheme:", scheme);

      const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

      console.log("Auth session result:", JSON.stringify(result))

      if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log("User cancelled auth session");
        return false;
      }

      if (result.type === 'success') {
        //const successResult = result as WebBrowser.WebBrowserRedirectResult;
        const url = new URL(result.url);
        console.log(url);
        const secret = url.searchParams.get('secret');
        const userId = url.searchParams.get('userId');

        if (userId && secret) {
      
          const account = new Account(client);
          await account.createSession({ userId: userId!, secret: secret! });

          let session = await account.getSession({sessionId: 'current'});
          let user=await account.get()

          console.log('email = ' + user.email)
          console.log('name = ' + user.name)

          if(session)
          {
            const playerId = createUserInDB(user.name, user.email, city, county, state, country, deviceType)
            return playerId
          }

          return false;
        }
      }
    }
    catch(error: any){
        console.error("Error in login with Oauth:", error);
        Alert.alert(
          'Sign In Error',
          `${error?.message || 'An error occurred during sign in. Please try again.'}`,
          [{ text: 'OK' }]
        );
        return false;
    }
  }
  
  
  export async function logout() {
    try {
      const result = await account.deleteSession({sessionId: "current"});
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  
  export async function getCurrentUser() {
    try {
      validateAppwriteConfig();
      const result = await account.get();
      //console.log("Appwrite response:", result);
      //console.log(result.labels)
      console.log(result.emailVerification)

      if (result.$id) {
        const userAvatar = avatar.getInitials(result.name);
        const userResult = await tablesdb.listRows({databaseId: config.databaseId!, tableId: config.playerCollectionId!, queries: [Query.equal('email', result.targets[0].identifier)]});
        const leagueMembership = await tablesdb.listRows({databaseId: config.databaseId!, tableId: config.memberCollectionId!, queries: [Query.equal('player', userResult.rows[0].$id)]});
        console.log("leagueMembership", leagueMembership);
        if(!leagueMembership.rows[0]){
          return {
            ...userResult.rows[0],
            isLeagueMember: false,
            labels: result.labels,
            emailVerified: result.emailVerification,
            leagueinfo: {
              league: {
                $id: '67f872ec002fad12bdbc',
                Name: 'Vista Tennis League'
              }
            }
          };
        }
        return {
          ...userResult.rows[0],
          isLeagueMember: true,
          labels: result.labels,
          emailVerified: result.emailVerification,
          leagueinfo: leagueMembership.rows[0]
        };
      }
  
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  export async function getLadderMembers(leagueId: string){
    try {
      console.log('Fetching Members with config:', {
        databaseId: config.databaseId,
        collectionId: config.memberCollectionId, 
        leagueId: leagueId
      });
      
      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.memberCollectionId!,
        queries: [Query.select(['*', 'player.*']), Query.equal('league', [leagueId]), Query.orderDesc('rating_value')]
      });
      
      console.log("Appwrite response get Ladder Members:", result.rows);
      return result;
    }
    catch (error) {
      console.error('Error fetching Members:', error);
      return null;
    }
  }
  
    export async function getPlayers(leagueId: string){
    try {
      console.log('Calling Appwrite get Players: Fetching players with config:', {
        databaseId: config.databaseId,
        collectionId: config.playerCollectionId
      });
      
      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.memberCollectionId!, 
        queries: [Query.equal('league', leagueId), Query.orderDesc('rating_value')]
    });
      
      console.log("Appwrite response for get Players:", result);
      return result;
    }
    catch (error) {
      console.error('Error fetching players:', error);
      return null;
    }
  }

  export async function getPlayersInLeagueExcludingUser(leagueId: string, UserId: string){
    try {
      console.log('Calling Appwrite get Players: Fetching players with config:', {
        databaseId: config.databaseId,
        collectionId: config.playerCollectionId, 
        leagueId: leagueId,
        currentUserId: UserId
      }); 
      
      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.memberCollectionId!, 
        queries: [Query.select(['*', 'player.*']), Query.equal('league', leagueId), Query.orderDesc('rating_value'), Query.notEqual('player', UserId)]
    });
      
      console.log("Appwrite response for get Players Excluding:", result);
      return result.rows;
    }
    catch (error) {
      console.error('Error fetching players excluding:', error);
      return null;
    }
  }

  export async function getMembership(player: string, league: string){
    try {
      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.memberCollectionId!,
        queries: [Query.equal('player', player), Query.equal('league', league)]
      });
      return result;
    }
    catch (error) {
      console.error('Error fetching membership:', error);
      return null;
    }
  }

  export async function getPlayerInfo(){
    try {
      console.log('Fetching players with config:', {
        databaseId: config.databaseId,
        collectionId: config.playerCollectionId
      });

      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.playerCollectionId!
      });

      console.log("Appwrite response:", result);
      return result;
    }
    catch (error) {
      console.error('Error fetching players:', error);
      return null;
    }
  }


  export async function getMatchResultsForLeague(leagueID: string){
    try {
      console.log('Fetching matches with leagueID:', leagueID);
      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.matchCollectionId!,
        queries: [Query.select(['*', 'league.*', 'player_id1.*', 'player_id2.*']), Query.equal('league', leagueID), Query.orderDesc('MatchDate')]
      });
      console.log("Appwrite getMatchResultsForLeague response:", result);
      return result;  
    }
    catch (error) {
      console.error('Error fetching matches:', error);
      return null;
    }
  }
  
  export async function getAllMatchResults(){
    try {
      //console.log('Fetching matches with config:', {
      //  databaseId: config.databaseId,
      //  collectionId: config.matchCollectionId
      //});

      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.matchCollectionId!
      });

      //console.log("Appwrite response:", result);
      return result;  
    }
    catch (error) {
      console.error('Error fetching matches:', error);
      return null;
    }
    
  }

  //export async function deleteUser(userId: string) {
  //  try {
  //    const Users
  //    const result = await (userId);
  //    return result;
   // } catch (error) {
   //   console.error('Error deleting user:', error);
   //   return null;

  export async function createLadder(ladderData: {
    Name: string,
    Description: string;
    LadderCode: string;
    CreateDate: string; 
    City: string;
    County: string;
    State: string;
    Country: string;
  }) {
    //matchData.league = config.globalLeagueId || '67e6ee1c001a8cded289';
    console.log('create Ladder');
    console.log(ladderData);
    const uniqueId = ID.unique();
    try {
      const result = await tablesdb.createRow({
        databaseId: config.databaseId!,
        tableId: config.leagueCollectionId!,
        rowId: uniqueId,
        data: ladderData
      });

      return result;
    } catch (error) {
      console.error('Error creating league:', error);
      throw error;
    }
  }

  export async function createMatchResult(matchData: {
    league: string,
    player_id1: string;
    player_id2: string;
    p1set1score: number ;
    p1set2score: number;
    p1set3score: number;
    p2set1score: number;
    p2set2score: number;
    p2set3score: number;
    winner: string;
    MatchDate: string;
    s1TieBreakerPointsLost: number | null;
    s2TieBreakerPointsLost: number | null;
    s3TieBreakerPointsLost: number | null;    
  }) {
    console.log('create match result');
    console.log(matchData);
    const uniqueId = ID.unique();
    try {
      const result = await tablesdb.createRow({
        databaseId: config.databaseId!,
        tableId: config.matchCollectionId!,
        rowId: uniqueId,
        data: matchData
      });
      if(matchData.winner == 'player1'){
          recalcRankings(matchData.league, matchData.player_id1, matchData.player_id2);
      }
      else{
        recalcRankings(matchData.league, matchData.player_id2, matchData.player_id1);
      }
      return result;
    } catch (error) {
      console.error('Error creating match result:', error);
      throw error;
    }
  }
  
  export async function recalcRankings(leagueId: string, winner: string, loser: string) {
    try {
      const KFactor = 32;
      console.log('Recalculating rankings for league:', leagueId);
      console.log('Winner:', winner);
      console.log('Loser:', loser);
      // Get membership documents for both players
      const winnerMembership = await getMembership(winner, leagueId);
      const loserMembership = await getMembership(loser, leagueId);

      console.log('Winner Membership:', winnerMembership);
      console.log('Loser Membership:', loserMembership);
      
      if (!winnerMembership?.rows?.[0] || !loserMembership?.rows?.[0]) {
        throw new Error("Membership not found");
      }

      const ratingW = winnerMembership.rows[0].rating_value || 0;
      const ratingL = loserMembership.rows[0].rating_value || 0;

      const expectedW = 1 / (1 + 10 ** ((ratingL - ratingW) / 400));
      const expectedL = 1 / (1 + 10 ** ((ratingW - ratingL) / 400));

      const newRankW = Math.round(Math.max(0, Math.min(10000, ratingW + KFactor * (1 - expectedW))));
      const newRankL = Math.round(Math.max(0, Math.min(10000, ratingL + KFactor * (0 - expectedL))));

      await databases.updateDocument(
        config.databaseId!, 
        config.memberCollectionId!, 
        winnerMembership.rows[0].$id, 
        { rating_value: newRankW, wins: winnerMembership.rows[0].wins + 1 }
      );
      await databases.updateDocument(
        config.databaseId!, 
        config.memberCollectionId!, 
        loserMembership.rows[0].$id, 
        { rating_value: newRankL, losses: loserMembership.rows[0].losses + 1 }
      );

      const result = await tablesdb.listRows({
        databaseId: config.databaseId!,
        tableId: config.memberCollectionId!,
        queries: [Query.equal('league', leagueId), Query.orderDesc('rating_value')]
      });

      for(let i = 0; i < result.rows.length; i++){ 
        await databases.updateDocument(
          config.databaseId!,
          config.memberCollectionId!,
          result.rows[i].$id,
          { rank: i + 1 }
        );
      }
      console.log("result", result);
      return result;
    } catch(error) {
      console.error('Error recalculating rankings:', error);
      throw error;
    }
  }