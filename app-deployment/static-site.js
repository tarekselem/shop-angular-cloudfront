#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSite = void 0;
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
class StaticSite extends core_1.Construct {
    constructor(parent, name) {
        super(parent, name);
        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'eShop-OAI');
        const siteBucket = new s3.Bucket(this, 'eShopAppBucket', {
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });
        siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['S3:GetObject'],
            resources: [siteBucket.arnForObjects('*')],
            principals: [
                new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId),
            ],
        }));
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'eShop-distribution', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket,
                        originAccessIdentity: cloudfrontOAI,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        new s3deploy.BucketDeployment(this, 'eShop-Bucket-Deployment', {
            sources: [s3deploy.Source.asset('./website')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0Esc0NBQXNDO0FBQ3RDLHVEQUF1RDtBQUN2RCxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUFpRDtBQUVqRCxNQUFhLFVBQVcsU0FBUSxnQkFBUztJQUN2QyxZQUFZLE1BQWEsRUFBRSxJQUFZO1FBQ3JDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQ3ZELElBQUksRUFDSixXQUFXLENBQ1osQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdkQsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1NBQ2xELENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxtQkFBbUIsQ0FDNUIsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLFVBQVUsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FDNUIsYUFBYSxDQUFDLCtDQUErQyxDQUM5RDthQUNGO1NBQ0YsQ0FBQyxDQUNILENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FDM0QsSUFBSSxFQUNKLG9CQUFvQixFQUNwQjtZQUNFLGFBQWEsRUFBRTtnQkFDYjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsY0FBYyxFQUFFLFVBQVU7d0JBQzFCLG9CQUFvQixFQUFFLGFBQWE7cUJBQ3BDO29CQUNELFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxpQkFBaUIsRUFBRSxJQUFJO3lCQUN4QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FDRixDQUFDO1FBRUYsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLHlCQUF5QixFQUFFO1lBQzdELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzdDLGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsWUFBWTtZQUNaLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXRERCxnQ0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vL0B0cy1ub2NoZWNrXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWRmcm9udCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNTaXRlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50OiBTdGFjaywgbmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lKTtcblxuICAgIGNvbnN0IGNsb3VkZnJvbnRPQUkgPSBuZXcgY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NJZGVudGl0eShcbiAgICAgIHRoaXMsXG4gICAgICAnZVNob3AtT0FJJ1xuICAgICk7XG5cbiAgICBjb25zdCBzaXRlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnZVNob3BBcHBCdWNrZXQnLCB7XG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICAgIH0pO1xuXG4gICAgc2l0ZUJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ1MzOkdldE9iamVjdCddLFxuICAgICAgICByZXNvdXJjZXM6IFtzaXRlQnVja2V0LmFybkZvck9iamVjdHMoJyonKV0sXG4gICAgICAgIHByaW5jaXBhbHM6IFtcbiAgICAgICAgICBuZXcgaWFtLkNhbm9uaWNhbFVzZXJQcmluY2lwYWwoXG4gICAgICAgICAgICBjbG91ZGZyb250T0FJLmNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eVMzQ2Fub25pY2FsVXNlcklkXG4gICAgICAgICAgKSxcbiAgICAgICAgXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oXG4gICAgICB0aGlzLFxuICAgICAgJ2VTaG9wLWRpc3RyaWJ1dGlvbicsXG4gICAgICB7XG4gICAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc2l0ZUJ1Y2tldCxcbiAgICAgICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHk6IGNsb3VkZnJvbnRPQUksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ2VTaG9wLUJ1Y2tldC1EZXBsb3ltZW50Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldCgnLi93ZWJzaXRlJyldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4gICAgICBkaXN0cmlidXRpb24sXG4gICAgICBkaXN0cmlidXRpb25QYXRoczogWycvKiddLFxuICAgIH0pO1xuICB9XG59XG4iXX0=